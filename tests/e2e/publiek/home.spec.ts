import { expect, test } from "@playwright/test";
import { databaseBeschikbaar, ZONDER_DATABASE } from "../helpers/database";

test.describe("homepage @readonly @smoke @mobiel", () => {
  test("beide doelgroepen hebben een knop binnen het eerste scherm op 390 px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const main = page.locator("main");
    for (const href of ["/vacatures", "/werkgevers/personeel-aanvragen"]) {
      const box = await main.locator(`a[href="${href}"]`).first().boundingBox();
      expect(box, href).not.toBeNull();
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);
    }
    const breedte = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(breedte).toBeLessThanOrEqual(390);
  });

  test("laatste vacatures linken naar hun detailpagina", async ({ page }) => {
    test.skip(!(await databaseBeschikbaar()), ZONDER_DATABASE);
    await page.goto("/");
    await expect(page.locator('main a[href^="/vacatures/"]').first()).toBeVisible();
  });
});
