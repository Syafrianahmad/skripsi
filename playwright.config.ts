import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const BASE_PATH = '/skripsi/'
const BASE_URL = `http://127.0.0.1:${PORT}${BASE_PATH}`

// E2E runs against the production build served under the GitHub Pages sub-path, like the deployed site
export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  forbidOnly: !!process.env.CI,
  use: {
    baseURL: BASE_URL,
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // --host: vite preview binds to localhost (IPv6 ::1 here), not the 127.0.0.1 baseURL
    command: `npm run build && npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    env: { BASE_PATH },
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
})
