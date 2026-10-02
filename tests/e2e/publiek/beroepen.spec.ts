import { expect, test } from "@playwright/test";
import { beroepen } from "@/content/beroepen";
import { paths } from "@/lib/routes";
import { databaseBeschikbaar } from "../helpers/database";
import { t } from "../helpers/messages";

test.describe("beroepspagina's @readonly", () => {
  for (const b of beroepen) {
    // De kop noemt het beroep, soms als samenstelling ("Schoonmaakpersoneel"):
    // vergelijk op de eerste zes letters van de naam.
    const stam = t(`beroepen.${b.id}.enkelvoud`).toLowerCase().slice(0, 6);

    test(`${paths.werkenAls(b.id)}: h1, ander perspectief en vacatures of lege staat`, async ({ page }) => {
      await page.goto(paths.werkenAls(b.id));
      await expect(page.locator("h1")).toContainText(new RegExp(stam, "i"));
      await expect(page.locator(`main a[href="${paths.werkgeverBeroep(b.id)}"]`).first()).toBeAttached();
      if (!(await databaseBeschikbaar())) {
        // Zonder vacatures nooit een doodlopende pagina: link naar inschrijven.
        await expect(page.locator('main a[href^="/inschrijven"]').first()).toBeAttached();
      }
    });

    test(`${paths.werkgeverBeroep(b.id)}: h1 en ander perspectief`, async ({ page }) => {
      await page.goto(paths.werkgeverBeroep(b.id));
      await expect(page.locator("h1")).toContainText(new RegExp(stam, "i"));
      await expect(page.locator(`main a[href="${paths.werkenAls(b.id)}"]`).first()).toBeAttached();
    });
  }

  test("FAQ-JSON-LD noemt dezelfde vragen als de pagina", async ({ page }) => {
    await page.goto(paths.werkenAls("glazenwasser"));
    const blokken = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faq = blokken
      .map((b) => JSON.parse(b) as { "@type"?: string; mainEntity?: { name: string }[] })
      .find((b) => b["@type"] === "FAQPage");
    expect(faq?.mainEntity?.length).toBeGreaterThan(0);
    for (const vraag of faq?.mainEntity ?? []) {
      await expect(page.getByText(vraag.name, { exact: true }).first()).toBeAttached();
    }
  });
});
