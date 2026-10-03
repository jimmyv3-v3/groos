import { expect, test } from "@playwright/test";
import { databaseBeschikbaar } from "../helpers/database";
import { t } from "../helpers/messages";

test.describe("vacatureoverzicht @readonly @mobiel", () => {
  test("zonder vacatures een lege staat met inschrijflink", async ({ page }) => {
    test.skip(await databaseBeschikbaar(), "Met database staan er seedvacatures; de lege staat geldt alleen zonder vacatures");
    const res = await page.goto("/vacatures");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: t("vacatures.empty.none.title") })).toBeVisible();
    await expect(page.locator('main a[href^="/inschrijven"]').first()).toBeVisible();
  });

  test("met een filter in de URL blijft de pagina werken", async ({ page }) => {
    const res = await page.goto("/vacatures?beroep=glazenwasser&q=ramen");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
