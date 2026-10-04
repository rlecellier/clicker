import { defineConfig } from '@playwright/test';

// DEMO=1 records a video and a screenshot of every test, used by the
// `MR demo` workflow. Without it the journeys run as plain e2e tests.
const isDemo = Boolean(process.env.DEMO);

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    video: isDemo ? { mode: 'on', size: { width: 480, height: 560 } } : 'off',
    screenshot: isDemo ? 'on' : 'off',
    viewport: { width: 480, height: 560 },
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
