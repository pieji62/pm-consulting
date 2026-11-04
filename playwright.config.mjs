import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  workers: 2,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'evidence/browser.json' }]],
  use: { baseURL: process.env.WORKSHOP_TEST_URL || 'http://127.0.0.1:4322', trace: 'retain-on-failure' },
  projects: [
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 375, height: 812 } } },
    { name: 'tablet', use: { browserName: 'chromium', viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } }
  ]
});
