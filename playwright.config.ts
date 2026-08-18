import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://localhost:5678'

export default defineConfig<ConfigOptions>({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['html'], ['junit', { outputFile: 'test-report.junit.xml' }]]
    : 'html',
  timeout: 120_000,
  webServer: {
    command: 'pnpm test:browser:start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    nuxt: {
      rootDir: import.meta.dirname,
      host: baseURL,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
