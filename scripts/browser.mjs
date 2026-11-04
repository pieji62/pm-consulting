import path from 'node:path';
import { spawn } from 'node:child_process';
import { startServer } from './serve.mjs';
// Let the OS choose a free loopback port. Never reuse an unrelated preview server.
const server = await startServer('dist', 0);
try {
  const child = spawn(process.execPath, [path.resolve('node_modules/@playwright/test/cli.js'), 'test'], {
    stdio: 'inherit', env: { ...process.env, WORKSHOP_TEST_URL: server.url }, timeout: 150000
  });
  process.exitCode = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', code => resolve(code ?? 1)); });
} finally { await server.close(); }
