import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
export const excluded = new Set(['node_modules', '.git', 'dist', '.astro', '.cache', '.tools', 'evidence', 'test-results', 'playwright-report', 'projects', 'releases']);
export function walk(root, base = root) {
  return fs.readdirSync(root, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name)).flatMap(entry => {
    if (excluded.has(entry.name) || entry.name === '.workshop') return [];
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symbolic links are not allowed in project sources.');
    return entry.isDirectory() ? walk(file, base) : [path.relative(base, file).replaceAll('\\', '/')];
  });
}
export const hash = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
export function fingerprint(root) {
  return hash(walk(root).filter(f => !f.endsWith('.log') && !f.endsWith('.tmp')).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
}
export function writeJSON(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(temporary, file);
}
export const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
export function copyTree(source, destination) {
  for (const file of walk(source)) {
    const target = path.join(destination, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(source, file), target, fs.constants.COPYFILE_EXCL);
  }
}
