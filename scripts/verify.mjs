import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { checkScope, checkStatic, checkSecrets, checkDist } from './checks.mjs';
import { fingerprint, hash, writeJSON } from '../orchestrator/files.mjs';
import { load, mutate, mandatory } from '../orchestrator/controller.mjs';
import { archiveEvidence } from './evidence.mjs';
export function runNpm(root, args) {
  const cli = process.env.npm_execpath;
  if (!cli) throw new Error('Run this task through npm run verify.');
  const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 20 * 1024 * 1024, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
  return { code: result.status ?? 1, output: `${result.stdout || ''}\n${result.stderr || ''}`, error: result.error?.message };
}
export function verify(root) {
  // Invalidate earlier success before starting any executable tool.
  mutate(root, s => { s.verification = null; s.deploymentApproval = null; s.stage = 'verification'; return s; });
  archiveEvidence(root);
  const sourceHash = fingerprint(root); const checks = [];
  function check(name, operation, dependency) {
    if (dependency && checks.find(c => c.name === dependency)?.status !== 'passed') { checks.push({ name, status: 'not-executed', detail: `Depends on ${dependency}.` }); return; }
    const began = Date.now();
    try { const detail = operation(); checks.push({ name, status: 'passed', detail: detail ?? 'Check executed.', durationMs: Date.now() - began }); }
    catch (e) { checks.push({ name, status: 'failed', detail: e.message, durationMs: Date.now() - began }); }
    console.log(`${name}: ${checks.at(-1).status === 'passed' ? 'passed' : 'failed'}`);
  }
  function command(name, args) {
    const result = runNpm(root, args);
    fs.writeFileSync(path.join(root, `evidence/${name}.log`), result.output);
    if (result.code !== 0) throw new Error(`The check failed. Ask the agent to inspect evidence/${name}.log. ${result.error ?? ''}`);
    return `Log: evidence/${name}.log`;
  }
  check('scope', () => checkScope(root));
  check('static', () => checkStatic(root), 'scope');
  check('secrets', () => checkSecrets(root));
  check('types', () => command('types', ['run', 'check']), 'static');
  check('build', () => command('build', ['run', 'build']), 'static');
  check('links-performance', () => checkDist(root), 'build');
  check('browser-accessibility', () => command('browser', ['test']), 'links-performance');
  check('dependencies', () => command('dependencies', ['audit', '--audit-level=low', '--json']));
  if (fingerprint(root) !== sourceHash) checks.push({ name: 'source-integrity', status: 'failed', detail: 'Sources changed during verification.' });
  const state = load(root);
  const report = { version: 1, sourceHash, requirementsHash: hash(state.requirements), finishedAt: new Date().toISOString(), node: process.version, checks,
    manual: ['Content accuracy and usage rights', 'Legal and privacy assessment', 'Screen-reader and human testing', 'External HTTPS links (not automatically visited), external services and DNS', 'Performance on real devices and networks'],
    limitations: 'Pattern-based secret scanning cannot prove credentials are absent. Axe cannot prove complete accessibility. File budgets do not measure Core Web Vitals.' };
  writeJSON(path.join(root, 'evidence/verification.json'), report);
  const labels = { passed: 'PASSED', failed: 'FAILED', 'not-executed': 'NOT EXECUTED' };
  fs.writeFileSync(path.join(root, 'evidence/report.md'), `# Verification results\n\n${checks.map(c => `- ${c.name}: **${labels[c.status]}**. ${typeof c.detail === 'string' ? c.detail : JSON.stringify(c.detail)}`).join('\n')}\n\n## Pending human review\n\n${report.manual.map(x => `- ${x}`).join('\n')}\n\n${report.limitations}\n`);
  mutate(root, s => { s.verification = report; s.failures = checks.filter(c => c.status !== 'passed'); s.stage = s.failures.length ? 'blocked' : 'verified'; return s; });
  return mandatory.every(name => checks.some(c => c.name === name && c.status === 'passed')) && checks.every(c => c.status === 'passed');
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { process.exitCode = verify(process.cwd()) ? 0 : 1; }
  catch (e) { console.error(`Verification did not complete: ${e.message}`); process.exitCode = 1; }
}
