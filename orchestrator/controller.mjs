import fs from 'node:fs';
import path from 'node:path';
import { classify } from './classify.mjs';
import { hash, fingerprint, readJSON, writeJSON, copyTree } from './files.mjs';
export const mandatory = ['scope', 'static', 'secrets', 'types', 'build', 'links-performance', 'browser-accessibility', 'dependencies'];
const stateFile = root => path.join(root, '.workshop/state.json');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
export function start(root) {
  if (fs.existsSync(stateFile(root))) return load(root);
  assert(!fs.existsSync(root) || fs.readdirSync(root).length === 0, 'Choose an empty folder for the new site.');
  const state = { version: 1, revision: 0, stage: 'discovery', approvals: [], artifacts: [], verification: null, failures: [] };
  writeJSON(stateFile(root), state);
  return state;
}
export function load(root) {
  const state = readJSON(stateFile(root));
  assert(state.version === 1, 'Unsupported state version; request assistance.');
  return state;
}
export function mutate(root, action) {
  const lock = path.join(root, '.workshop/lock');
  let fd;
  try {
    fd = fs.openSync(lock, 'wx');
    const state = load(root);
    const result = action(state) ?? state;
    writeJSON(stateFile(root), result);
    return result;
  } finally { if (fd !== undefined) { fs.closeSync(fd); fs.unlinkSync(lock); } }
}
export function validateRequirements(r) {
  for (const key of ['businessName', 'businessType', 'audience', 'objective', 'visual', 'branding', 'contact', 'contentSource'])
    assert(typeof r?.[key] === 'string' && r[key].trim().length > 0 && r[key].length < 5000, `Complete ${key} with confirmed information (or mark it pending).`);
  assert(Array.isArray(r.languages) && r.languages.length > 0 && r.languages.every(l => /^[a-z]{2}(-[A-Z]{2})?$/.test(l)), 'Specify valid languages.');
  assert(Array.isArray(r.pages) && r.pages.length > 0 && r.pages.length <= 30, 'Specify between 1 and 30 pages.');
  const slugs = new Set();
  for (const p of r.pages) {
    assert(typeof p.title === 'string' && p.title.trim() && typeof p.body === 'string' && p.body.trim(), 'Each page needs an approved title and body.');
    assert(p.lang === undefined || r.languages.includes(p.lang), 'Each page language must be approved.');
    assert(p.slug === '' || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug), 'Invalid page route.');
    assert(!slugs.has(p.slug), 'Page routes must be unique.'); slugs.add(p.slug);
  }
  assert(slugs.has(''), 'Include the home page with an empty slug.');
  assert(Array.isArray(r.features) && r.features.length > 0 && r.features.length <= 100, 'Describe the requested functionality.');
  for (const f of r.features) assert(typeof f.description === 'string' && f.description.length <= 5000, 'Invalid feature description.');
  return r;
}
export function intake(root, requirements) {
  validateRequirements(requirements);
  return mutate(root, state => {
    fs.mkdirSync(path.join(root, '.workshop/history'), { recursive: true });
    writeJSON(path.join(root, `.workshop/history/revision-${state.revision}.json`), state);
    state.requirements = requirements; state.classification = classify(requirements);
    state.revision++; state.requirementsHash = hash(requirements);
    state.proposal = null; state.verification = null; state.deploymentApproval = null;
    state.stage = state.classification.blocked ? 'blocked' : 'requirements-review';
    state.failures = state.classification.items.filter(i => i.level !== 'GREEN').map(i => i.reason);
    return state;
  });
}
export function approved(state, kind) {
  const digest = kind === 'requirements' ? hash(state.requirements) : hash(state.proposal);
  return state.approvals.some(a => a.kind === kind && a.digest === digest && a.revision === state.revision);
}
export function scopeGate(state) {
  validateRequirements(state.requirements);
  assert(!classify(state.requirements).blocked, 'Unresolved Yellow or Red requirements remain.');
  assert(approved(state, 'requirements') && approved(state, 'proposal'), 'Current requirements and proposal need approval.');
  assert(state.proposal?.requirementsHash === hash(state.requirements), 'The proposal does not match current requirements.');
}
export function approve(root, kind, phrase) {
  return mutate(root, state => {
    assert(['requirements', 'proposal'].includes(kind), 'Unknown approval type.');
    assert(phrase === `APPROVE ${state.revision}`, 'Approval must identify the displayed revision.');
    assert(!classify(state.requirements).blocked, 'Out-of-scope requirements cannot be approved.');
    assert(kind === 'requirements' ? state.stage === 'requirements-review' : state.stage === 'proposal-review', 'This approval does not match the current step.');
    state.approvals.push({ kind, revision: state.revision, digest: hash(kind === 'requirements' ? state.requirements : state.proposal), at: new Date().toISOString(), statement: phrase });
    state.stage = kind === 'requirements' ? 'planning' : 'development';
    return state;
  });
}
export function plan(root) {
  return mutate(root, state => {
    assert(approved(state, 'requirements') && !classify(state.requirements).blocked, 'Approve compatible requirements first.');
    const r = state.requirements;
    state.proposal = { requirementsHash: hash(r), pages: r.pages, features: r.features, visual: r.visual,
      solution: 'Static Astro pages using HTML and CSS, without accounts or data storage.',
      hosting: 'Azure Static Web Apps Free for demonstration; check quotas and terms before commercial use.',
      externalServices: [], costs: 'Domains and agent access may cost money. No service is contracted automatically.',
      limitations: 'Automated checks do not guarantee security, complete accessibility or legal compliance.',
      outOfScope: ['Form submissions', 'Customer accounts', 'Payment collection', 'Unassessed external services'] };
    state.stage = 'proposal-review'; state.verification = null; state.deploymentApproval = null;
    return state;
  });
}
export function generate(root, productRoot) {
  const state = load(root); scopeGate(state);
  assert(!fs.existsSync(path.join(root, 'package.json')), 'The site already exists. Edit and verify it again; never overwrite it.');
  copyTree(path.join(productRoot, 'templates/astro-static-site'), root);
  for (const dir of ['orchestrator', '.agents/skills', 'docs/en']) copyTree(path.join(productRoot, dir), path.join(root, dir));
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  for (const file of ['checks.mjs', 'verify.mjs', 'evidence.mjs', 'serve.mjs', 'browser.mjs', 'availability.mjs'])
    fs.copyFileSync(path.join(productRoot, 'scripts', file), path.join(root, 'scripts', file), fs.constants.COPYFILE_EXCL);
  // Content remains JSON data and Astro escapes it; never interpolate it as code.
  writeJSON(path.join(root, 'src/data/site.json'), {
    name: state.requirements.businessName, description: state.requirements.objective,
    lang: state.requirements.languages[0], contact: state.requirements.contact,
    pages: state.requirements.pages
  });
  return mutate(root, s => { s.stage = 'verification'; s.artifacts = ['src/data/site.json', '.github/workflows', 'docs/en', '.agents/skills']; return s; });
}
export function verificationReady(report, digest) {
  return Boolean(report && report.sourceHash === digest && mandatory.every(name => report.checks?.some(c => c.name === name && c.status === 'passed')) && report.checks.every(c => c.status === 'passed') && Date.now() - Date.parse(report.finishedAt) < 24 * 60 * 60 * 1000 && Date.parse(report.finishedAt) <= Date.now());
}
export function ready(root) {
  const state = load(root); scopeGate(state);
  assert(state.verification?.requirementsHash === hash(state.requirements), 'Verification belongs to different requirements.');
  assert(verificationReady(state.verification, fingerprint(root)), 'Verification is incomplete, failed, expired or predates changes. Run npm run verify.');
  return true;
}
export function authorizeDeployment(root, phrase) {
  ready(root);
  return mutate(root, state => {
    assert(phrase === 'AUTHORIZE PUBLICATION', 'Publication requires explicit authorization.');
    state.deploymentApproval = { at: new Date().toISOString(), sourceHash: fingerprint(root), statement: phrase };
    state.stage = 'deployment-ready'; return state;
  });
}
export function handover(root) {
  const s = load(root); const r = s.requirements; validateRequirements(r);
  const brief = { objective: r.objective, requestedFunctionality: r.features,
    assessment: classify(r), architecture: 'Static Astro; no backend, database or authentication.',
    securityPrivacy: ['Data minimization', 'Ownership and retention', 'Credential management', 'Permissions and threats'],
    architecturalConsiderations: ['Can the service be separated from the information site?', 'Who will maintain the integration and its availability?'],
    integrations: r.features.filter(f => classify({ features: [f] }).blocked),
    openQuestions: ['What data enters and leaves?', 'Which provider and budget are authorized?', 'Which legal obligations apply?', 'Who approves and maintains the solution?'] };
  writeJSON(path.join(root, '.workshop/engineering-brief.json'), brief);
  return brief;
}
