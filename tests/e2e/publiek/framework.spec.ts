import { expect, test } from "@playwright/test";
import { BEROEP_ROUTES } from "../../routes";
import { t } from "../helpers/messages";

// Header, footer en actiebalk van spec 01 (§4.4 tot en met §4.8) met de copy van spec 03 §6.14.

test.describe("headerknop per doelgroep (AC-01-12) @readonly", () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  const GEVALLEN: [string, string, string][] = [
    ["/werken-als/verhuizer", "common.cta.register", "/inschrijven"],
    ["/inschrijven", "common.cta.viewJobs", "/vacatures"],
    ["/", "common.cta.requestStaff", "/werkgevers/personeel-aanvragen"],
    ["/werkgevers/verhuizers", "common.cta.requestStaff", "/werkgevers/personeel-aanvragen"],
    ["/werkgevers/personeel-aanvragen", "common.cta.contact", "/contact"],
  ];
  for (const [pad, sleutel, doel] of GEVALLEN) {
    test(`${pad}: ${t(sleutel)}`, async ({ page }) => {
      await page.goto(pad);
      const knop = page.locator("header").first().getByRole("link", { name: t(sleutel), exact: true });
      await expect(knop).toBeVisible();
      await expect(knop).toHaveAttribute("href", doel);
    });
  }
});

test.describe("header zonder JavaScript @readonly", () => {
  test.use({ javaScriptEnabled: false });

  test("desktop: Werkzoekenden en Werkgevers zijn gewone links", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const menu = page.getByRole("navigation", { name: t("header.mainMenu") });
    for (const [sleutel, href] of [
      ["header.nav.werkzoekenden", "/werkzoekenden"],
      ["header.nav.werkgevers", "/werkgevers"],
    ] as const) {
      await expect(menu.getByRole("link", { name: t(sleutel), exact: true })).toHaveAttribute("href", href);
      await expect(menu.getByRole("button", { name: t(sleutel) })).toBeHidden();
    }
  });

  test("mobiel: de menuknop springt naar het linkoverzicht in de footer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const knop = page.locator("header").first().getByRole("link", { name: t("header.openMenu") });
    await expect(knop).toBeVisible();
    await expect(knop).toHaveAttribute("href", "#footermenu");
    await expect(page.locator("#footermenu")).toHaveAttribute("aria-label", t("footer.navLabel"));
  });
});

test.describe("met JavaScript blijft het uitklapmenu @readonly", () => {
  test("desktop: geen dubbele links in het hoofdmenu", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const menu = page.getByRole("navigation", { name: t("header.mainMenu") });
    await expect(menu.getByRole("button", { name: t("header.nav.werkzoekenden") })).toBeVisible();
    await expect(menu.getByRole("link", { name: t("header.nav.werkzoekenden"), exact: true })).toBeHidden();
  });

  test("mobiel: de menuknop opent het venster", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator("header").first().getByRole("link", { name: t("header.openMenu") })).toBeHidden();
    await page.getByRole("button", { name: t("header.openMenu") }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog").getByRole("link", { name: t("common.cta.register") })).toBeVisible();
  });
});

test.describe("footer (AC-01-19, AC-03-09) @readonly", () => {
  for (const [pad, locale] of [
    ["/", "nl"],
    ["/werkgevers/glazenwassers", "nl"],
    ["/en/contact", "en"],
  ] as const) {
    test(`${pad}`, async ({ page }) => {
      await page.goto(pad);
      const footer = page.locator("body > footer");
      await expect(footer).toContainText("Hugo Coenraadspad 6");
      await expect(footer).toContainText("2553 ER Den Haag");
      await expect(footer).toContainText(t("common.address.byAppointment", { locale }));
      await expect(footer).toContainText(t("footer.description", { locale }));
      await expect(footer).toContainText(`© ${new Date().getFullYear()} Groos Personeelsdiensten B.V.`);
      for (const href of ["tel:+31683351985", "mailto:info@groospersoneelsdiensten.nl"]) {
        await expect(footer.locator(`a[href="${href}"]`).first()).toBeAttached();
      }
      await expect(footer.locator('a[href^="https://wa.me/31683351985"]').first()).toBeAttached();
      const prefix = locale === "en" ? "/en" : "";
      for (const doc of ["/privacyverklaring", "/cookieverklaring", "/klachtenregeling"]) {
        await expect(footer.locator(`a[href="${prefix}${doc}"]`)).toHaveCount(1);
      }
      await expect(footer.locator('a[href$="/algemene-voorwaarden"]')).toHaveCount(0);
      for (const beroep of BEROEP_ROUTES) await expect(footer.locator(`a[href="${prefix}${beroep}"]`)).toHaveCount(1);
      // Kantoortijden alleen als contact.openingHours gevuld is (AC-03-11).
      await expect(footer).not.toContainText(t("common.contact.officeHours", { locale }));
    });
  }
});

test.describe("actiebalk (AC-01-16) @readonly", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const [pad, rechts] of [
    ["/werken-als/schoonmaker", "common.cta.whatsapp"],
    ["/werkgevers/schoonmakers", "common.cta.requestStaff"],
    ["/werkgevers/personeel-aanvragen", "common.cta.whatsapp"],
    ["/", "common.cta.whatsapp"],
  ] as const) {
    test(`${pad}`, async ({ page }) => {
      await page.goto(pad);
      const balk = page.getByRole("navigation", { name: t("header.actionBar") });
      await expect(balk.getByRole("link", { name: t("common.cta.call") })).toBeVisible();
      await expect(balk.getByRole("link", { name: t(rechts) })).toBeVisible();
    });
  }
});
