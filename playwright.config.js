const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/smoke',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Minimal configuration, no parallelization
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3001', // Frontend port
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
