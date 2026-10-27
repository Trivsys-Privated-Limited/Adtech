import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;

/**
 * End-to-end tests run against the production build (`npm run build` first).
 * Set PW_CHANNEL=msedge or PW_CHANNEL=chrome to use an installed browser
 * instead of downloading Playwright's Chromium (`npx playwright install chromium`).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  // Headless WebGL is software-rendered and CPU-heavy; cap parallelism to keep runs stable.
  workers: process.env.CI ? 2 : 4,
  expect: { timeout: 10_000 },
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    // Mark the first-visit welcome message as already seen so it doesn't cover
    // the page under test. Modal tests opt back in with an empty storage state.
    storageState: {
      cookies: [],
      origins: [{ origin: BASE_URL, localStorage: [{ name: "adtech:welcome-seen-at", value: String(Date.now()) }] }],
    },
    trace: "retain-on-failure",
    ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // The suite asserts the honest "not configured" contact and newsletter behaviour.
    env: { CONTACT_WEBHOOK_URL: "", NEWSLETTER_WEBHOOK_URL: "" },
  },
});
