import { defineConfig, devices } from "@playwright/test";

// E2e-configuratie (spec 14 §4.2). Zonder E2E_BASE_URL bouwt Playwright de app
// en start `next start` op poort 3100. Met E2E_BASE_URL=http://localhost:3130
// draait de suite tegen een server die al loopt (bijvoorbeeld `next dev -p 3130`).

try {
  process.loadEnvFile(".env.local");
} catch {
  /* geen .env.local: alleen @readonly tegen E2E_BASE_URL */
}

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const EIGEN_SERVER = !process.env.E2E_BASE_URL;
const LOKAAL = new URL(BASE_URL).hostname === "localhost";
const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testMatch: "**/*.spec.ts",
  outputDir: ".playwright-mcp/test-results",
  reporter: [["list"], ["html", { outputFolder: ".playwright-mcp/playwright-report", open: "never" }]],
  fullyParallel: true,
  workers: 2,
  retries: 0,
  grep: LOKAAL ? undefined : /@readonly/,
  globalTeardown: LOKAAL ? "./tests/e2e/global-teardown.ts" : undefined,
  use: {
    baseURL: BASE_URL,
    locale: "nl-NL",
    timezoneId: "Europe/Amsterdam",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    extraHTTPHeaders: BYPASS ? { "x-vercel-protection-bypass": BYPASS } : undefined,
  },
  webServer: EIGEN_SERVER
    ? {
        command: "npm run build && npx next start -p 3100",
        url: "http://localhost:3100",
        reuseExistingServer: false,
        timeout: 300_000,
        env: { EMAIL_DEV_TO: "delivered+e2e@resend.dev" },
      }
    : undefined,
  projects: [
    { name: "setup", testDir: "tests/e2e", testMatch: /beheer\.setup\.ts/ },
    {
      name: "chromium",
      testDir: "tests/e2e",
      testIgnore: /\.setup\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "mobiel",
      testDir: "tests/e2e",
      grep: /@mobiel/,
      dependencies: ["setup"],
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
    },
    { name: "webkit", testDir: "tests/e2e", grep: /@smoke/, use: { ...devices["iPhone 15"] } },
    { name: "visueel", testDir: "tests/visual", use: { ...devices["Desktop Chrome"] } },
  ],
});
