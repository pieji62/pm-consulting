import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { walk, readJSON } from '../orchestrator/files.mjs';
import { load, scopeGate } from '../orchestrator/controller.mjs';
export function checkScope(root) {
  const state = load(root); scopeGate(state);
  const data = readJSON(path.join(root, 'src/data/site.json'));
  const expected = state.requirements;
  if (JSON.stringify(data.pages) !== JSON.stringify(expected.pages) || data.name !== expected.businessName || data.description !== expected.objective || data.contact !== expected.contact || data.lang !== expected.languages[0])
    throw new Error('Content differs from approved requirements. Classify and approve the new revision.');
}
export function checkStatic(root) {
  const pkg = readJSON(path.join(root, 'package.json'));
  const allowed = new Set(['astro', '@astrojs/check', '@axe-core/playwright', '@playwright/test', 'typescript']);
  for (const [name, version] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
    if (!allowed.has(name) || !/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Unassessed dependency or non-exact version: ${name}`);
  }
  for (const key of ['preinstall', 'postinstall', 'install', 'prepare', 'prebuild', 'postbuild'])
    if (pkg.scripts?.[key]) throw new Error('Additional install/build scripts require professional review.');
  const config = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
  if (!/output:\s*['"]static['"]/.test(config) || /adapter|integrations|process\.env/.test(config)) throw new Error('Astro configuration is outside static scope.');
  const bad = /set:html|<script\b|<iframe\b|<form\b|client:|prerender\s*=\s*false|process\.env|import\.meta\.env|fetch\s*\(|src=["']https?:|@import|url\(["']?https?:|<link[^>]*href=["']https?:|\bon[a-z]+\s*=|child_process|from\s*["']node:|\beval\s*\(/i;
  for (const file of walk(path.join(root, 'src'))) {
    if (/\.(mjs|js|ts|jsx|tsx)$/.test(file)) throw new Error(`Additional executable code requires assessment: src/${file}`);
    if (/\.(astro|css)$/.test(file) && bad.test(fs.readFileSync(path.join(root, 'src', file), 'utf8'))) throw new Error(`Dynamic feature, external service or unescaped HTML: src/${file}`);
  }
  const security = readJSON(path.join(root, 'public/staticwebapp.config.json'));
  for (const rule of ["default-src 'none'", "form-action 'none'", "frame-ancestors 'none'", "script-src 'none'"])
    if (!security.globalHeaders?.['Content-Security-Policy']?.includes(rule)) throw new Error('A required hosting protection is missing.');
}
export function secretFindings(text) {
  const patterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
    /\bAKIA[A-Z0-9]{16}\b/,
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{30,}\b/,
    /(?:postgres(?:ql)?|mysql):\/\/[^\s:]+:[^\s@]+@/i,
    /(?:api[_-]?key|password|secret|token)\s*[=:]\s*["'][A-Za-z0-9/+_=.-]{24,}["']/i
  ];
  return patterns.some(p => p.test(text));
}
export function checkSecrets(root) {
  const files = walk(root);
  if (fs.existsSync(path.join(root, '.workshop/state.json'))) files.push('.workshop/state.json');
  for (const file of files) {
    if (/(^|\/)\.env(?:\.|$)/.test(file)) throw new Error(`Environment file not allowed: ${file}`);
    if (secretFindings(fs.readFileSync(path.join(root, file), 'utf8'))) throw new Error(`Possible credential in ${file}. Its value is hidden. Remove it and assess rotation.`);
  }
  if (fs.existsSync(path.join(root, '.git'))) {
    const shallow = spawnSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: root, encoding: 'utf8' });
    if (shallow.status !== 0 || shallow.stdout.trim() !== 'false') throw new Error('Full Git history is required for scanning.');
    const history = spawnSync('git', ['log', '--all', '-p', '--format=', '--no-ext-diff'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 60000 });
    if (history.status !== 0) throw new Error('Unable to scan all Git history.');
    if (secretFindings(history.stdout)) throw new Error('Possible credential in Git history. Get help to revoke it and sanitize history.');
  }
}
export function checkDist(root) {
  const dist = path.join(root, 'dist');
  const files = walk(dist); let total = 0; const externalLinks = new Set();
  const site = readJSON(path.join(root, 'src/data/site.json'));
  for (const p of site.pages) if (!fs.existsSync(path.join(dist, p.slug, 'index.html'))) throw new Error(`Missing page ${p.slug || 'home'}.`);
  for (const file of files) {
    const size = fs.statSync(path.join(dist, file)).size; total += size;
    if (size > 500 * 1024) throw new Error(`File too large (>500 KB): ${file}`);
    if (file.endsWith('.js')) throw new Error('The base site needs no JavaScript; assess it before adding any.');
    if (!file.endsWith('.html')) continue;
    const html = fs.readFileSync(path.join(dist, file), 'utf8');
    if (/<(?:script|iframe|form)\b/i.test(html)) throw new Error(`Dynamic content outside scope: ${file}`);
    for (const match of html.matchAll(/(href|src)="([^"]+)"/g)) {
      const url = new URL(match[2].replaceAll('&amp;', '&'), `https://local.invalid/${file.replace(/index\.html$/, '')}`);
      if (['mailto:', 'tel:'].includes(url.protocol)) continue;
      if (url.origin !== 'https://local.invalid') {
        if (match[1] !== 'href' || url.protocol !== 'https:') throw new Error(`External resource not allowed: ${file}`);
        externalLinks.add(url.href); continue;
      }
      const relative = decodeURIComponent(url.pathname).replace(/^\//, '');
      let target = path.resolve(dist, relative);
      if (!target.startsWith(path.resolve(dist) + path.sep) && target !== path.resolve(dist)) throw new Error('Path is outside the site.');
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target)) throw new Error(`Broken internal link in ${file}: ${url.pathname}`);
      if (url.hash && !fs.readFileSync(target, 'utf8').includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) throw new Error(`Missing anchor in ${file}`);
    }
  }
  if (total > 3 * 1024 * 1024) throw new Error('The site exceeds its initial 3 MB budget.');
  return { files: files.length, bytes: total, budget: 3 * 1024 * 1024, externalLinksPendingManualReview: [...externalLinks] };
}
