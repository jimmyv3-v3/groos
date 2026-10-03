import { existsSync, readFileSync } from "node:fs";
import { expect, test as setup } from "@playwright/test";
import { S } from "@/app/beheer/_strings";
import { databaseBeschikbaar, ZONDER_DATABASE } from "./helpers/database";
import { totp, wachtOpVerseCode } from "./helpers/totp";

// Logt in via de echte inlogpagina en bewaart de sessie (spec 14 §5.6).
const ACCOUNT = ".playwright-mcp/.auth/beheer-e2e.json";
const SESSIE = ".playwright-mcp/.auth/beheer.json";

type Account = { email: string; password: string; totpSecret: string };

setup("beheersessie met TOTP", async ({ page }) => {
  setup.skip(!(await databaseBeschikbaar()), ZONDER_DATABASE);
  setup.skip(!existsSync(ACCOUNT), "Geen beheertestaccount: draai eerst node scripts/e2e-voorbereiden.mjs");
  const account = JSON.parse(readFileSync(ACCOUNT, "utf8")) as Account;

  await page.goto("/beheer/inloggen");
  await page.getByLabel(S.auth.login.email).fill(account.email);
  await page.getByLabel(S.auth.login.password, { exact: true }).fill(account.password);
  await page.getByRole("button", { name: S.auth.login.submit }).click();
  await page.waitForURL(/\/beheer\/mfa/);
  await wachtOpVerseCode(5);
  await page.getByLabel(S.auth.mfa.code).fill(totp(account.totpSecret));
  await page.getByRole("button", { name: S.auth.mfa.submit }).click();
  await page.waitForURL((url) => url.pathname === "/beheer");
  await expect(page.locator("h1")).toBeVisible();
  await page.context().storageState({ path: SESSIE });
});
