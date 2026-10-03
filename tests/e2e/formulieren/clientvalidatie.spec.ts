import { expect, test } from "@playwright/test";

// Clientvalidatie van spec 07 §4.3: versturen zonder invoer markeert de
// verplichte velden en zet de focus op het eerste ongeldige veld. Er gaat
// niets naar de server, dus de database is niet nodig.
const FORMULIEREN = ["/contact", "/inschrijven", "/werkgevers/personeel-aanvragen"];

test.describe("formulieren zonder invoer @readonly @mobiel", () => {
  for (const pad of FORMULIEREN) {
    test(`${pad}: verplichte velden krijgen een fout en de focus`, async ({ page }) => {
      await page.goto(pad);
      const form = page.locator("main form").first();
      await form.locator('button[type="submit"]').click();
      const ongeldig = form.locator('[aria-invalid="true"]');
      await expect(ongeldig.first()).toBeVisible();
      expect(await ongeldig.count()).toBeGreaterThan(0);
      const focusIsOngeldig = await page.evaluate(() => {
        const el = document.activeElement;
        return !!el && (el.getAttribute("aria-invalid") === "true" || !!el.closest('[aria-invalid="true"]'));
      });
      expect(focusIsOngeldig).toBe(true);
      expect(new URL(page.url()).pathname).toBe(pad);
    });
  }
});
