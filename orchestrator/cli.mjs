import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as controller from './controller.mjs';
import { readJSON } from './files.mjs';
const [command = 'help', destination = '.', argument] = process.argv.slice(2);
const root = path.resolve(destination);
const productRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function confirmation(message) {
  if (!stdin.isTTY) throw new Error('Approval requires a person in an interactive terminal.');
  const rl = createInterface({ input: stdin, output: stdout });
  try { return (await rl.question(message)).trim(); } finally { rl.close(); }
}
try {
  let result;
  switch (command) {
    case 'start': result = controller.start(root); break;
    case 'intake': result = controller.intake(root, readJSON(path.resolve(argument))); break;
    case 'status': result = controller.load(root); break;
    case 'plan': result = controller.plan(root); break;
    case 'approve': {
      const state = controller.load(root);
      console.log(JSON.stringify(argument === 'requirements' ? state.requirements : state.proposal, null, 2));
      result = controller.approve(root, argument, await confirmation(`Read the document above. To approve, type APPROVE ${state.revision}: `)); break;
    }
    case 'generate': result = controller.generate(root, productRoot); break;
    case 'handover': result = controller.handover(root); break;
    case 'ready': controller.ready(root); result = { message: 'Verification is current. Authorize upload separately in GitHub Actions.' }; break;
    case 'authorize': result = controller.authorizeDeployment(root, await confirmation('To authorize this version, type AUTHORIZE PUBLICATION: ')); break;
    default: console.log(`Welcome to AI Website Workshop.
Open this folder in Codex and say: "I want to create my site. Use workshop-discovery and ask me questions in English."
Start a project with: npm start -- start projects/my-site
Agent commands: intake <folder> <requirements.json>, status <folder>, plan <folder>,
approve <folder> requirements|proposal, generate <folder>, handover <folder>, ready <folder>.
A person types approvals in the terminal. Publication is never automatic.`); process.exit(0);
  }
  console.log(JSON.stringify(result, null, 2));
} catch (error) { console.error(`Unable to continue: ${error.message}`); process.exitCode = 1; }
