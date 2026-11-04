import fs from 'node:fs';
import path from 'node:path';

// Preserve the previous run before any log/report is replaced. History never nests.
export function archiveEvidence(root) {
  const evidence = path.join(root, 'evidence');
  fs.mkdirSync(evidence, { recursive: true });
  const entries = fs.readdirSync(evidence).filter(name => name !== 'history');
  if (!entries.length) return null;
  const history = path.join(evidence, 'history');
  fs.mkdirSync(history, { recursive: true });
  const destination = fs.mkdtempSync(path.join(history, 'run-'));
  for (const name of entries) {
    fs.cpSync(path.join(evidence, name), path.join(destination, name), {
      recursive: true, dereference: false, errorOnExist: true, force: false
    });
  }
  return destination;
}
