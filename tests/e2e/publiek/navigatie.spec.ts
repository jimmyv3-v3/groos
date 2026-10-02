import { expect, test } from "@playwright/test";
import { BEROEP_ROUTES, ONBEKENDE_ROUTES, VASTE_ROUTES, engels } from "../../routes";
import { t } from "../helpers/messages";

// Routes zonder database: 200, één h1 en een titel (spec 14 publiek/navigatie).
const ROUTES = [...VASTE_ROUTES, ...BEROEP_ROUTES];

test.describe("publieke routes @readonly @smoke @mobiel", () => {
  for (const pad of ROUTES) {
    for (const url of [pad, engels(pad)]) {
      test(`${url} geeft 200 met één h1 en een titel`, async ({ page }) => {
        const fouten: string[] = [];
        page.on("pageerror", (e) => fouten.push(e.message));
        const res = await page.goto(url);
        expect(res?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        expect((await page.title()).length).toBeGreaterThan(0);
        await expect(page.locator("html")).toHaveAttribute("lang", url.startsWith("/en") ? "en" : "nl");
        expect(fouten).toEqual([]);
      });
    }
  }

  test("header linkt via de uitklapmenu's naar werkzoekenden en werkgevers", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const header = page.locator("header").first();
    for (const [menu, href] of [
      [t("header.nav.werkzoekenden"), "/werkzoekenden"],
      [t("header.nav.werkgevers"), "/werkgevers"],
    ]) {
      await header.getByRole("button", { name: menu }).click();
      await expect(page.locator(`header a[href="${href}"]:visible, [data-slot^="navigation-menu"] a[href="${href}"]:visible`).first()).toBeVisible();
      await page.keyboard.press("Escape");
    }
  });
});

test.describe("404 (AC-01-02, AC-01-03) @readonly @smoke", () => {
  for (const url of ONBEKENDE_ROUTES) {
    test(`${url} geeft 404 met de gelokaliseerde pagina`, async ({ request }) => {
      const res = await request.get(url);
      expect(res.status()).toBe(404);
      const html = await res.text();
      const locale = url.startsWith("/en/") ? "en" : "nl";
      // Server-HTML, dus ook zonder JavaScript: h1, links en noindex.
      expect(html).toContain(`<html lang="${locale}"`);
      expect(html).toContain(t("notFound.title", { locale }));
      expect(html).toMatch(/<meta name="robots" content="noindex"\/?>/);
      for (const href of ["/vacatures", "/werkgevers/personeel-aanvragen", "/contact"]) {
        expect(html).toContain(`href="${locale === "en" ? `/en${href}` : href}"`);
      }
      expect(html).toContain("<header");
      expect(html).toContain("<footer");
    });
  }

  test.describe("zonder JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    test("de 404 toont kop en links", async ({ page }) => {
      const res = await page.goto("/een/twee/drie");
      expect(res?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1, name: t("notFound.title") })).toBeVisible();
      await expect(page.getByRole("link", { name: t("notFound.links.contact") })).toBeVisible();
    });
  });
});
