import { defineConfig, devices } from '@playwright/test'

// End-to-end tests run against the generated static site (npm run generate), i.e. exactly
// what gets deployed. Uses the locally installed Google Chrome — no browser download.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:3211',
    channel: 'chrome',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: 'node tests/support/static-server.mjs .output/public 3211',
    url: 'http://localhost:3211',
    reuseExistingServer: false,
    timeout: 90_000,
  },
})
