import { expect, test } from "@playwright/test";
import { t } from "../helpers/messages";

// Formulierpagina's en bedankpagina's zonder database (spec 07 §4.6 tot en met
// §4.10). Er wordt niets verstuurd.

test.describe("bedankpagina's (AC-07-20) @readonly", () => {
  for (const soort of ["sollicitatie", "inschrijving", "aanvraag", "contact"]) {
    test(`/bedankt/${soort}: noindex, één h1 en geen kruimelpad`, async ({ page }) => {
      const res = await page.goto(`/bedankt/${soort}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, follow/);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('nav[aria-label="' + t("common.breadcrumbs.label") + '"]')).toHaveCount(0);
    });
  }

  test("toont een geldige referentie en negeert een ongeldige", async ({ page }) => {
    await page.goto("/bedankt/sollicitatie?ref=S-2026-0001");
    await expect(page.getByText(t("bedankt.application.reference", { waarden: { reference: "S-2026-0001" } }))).toBeVisible();
    await page.goto("/bedankt/sollicitatie?ref=%3Cscript%3E");
    await expect(page.locator("main")).not.toContainText("referentienummer");
  });

  test("aanvraag: belknop bij de spoedregel, WhatsApp en de link naar werkgevers", async ({ page }) => {
    await page.goto("/bedankt/aanvraag");
    const main = page.locator("main");
    await expect(main.getByText(t("common.notes.urgentEmployer"))).toBeVisible();
    await expect(main.locator('a[href^="tel:"]')).toHaveCount(1);
    await expect(main.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
    await expect(main.getByRole("link", { name: t("bedankt.staffRequest.employersLink") })).toHaveAttribute("href", "/werkgevers");
  });

  test("contact: homepage, vacatures en personeel aanvragen", async ({ page }) => {
    await page.goto("/bedankt/contact");
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: t("bedankt.contact.homeLink") })).toHaveAttribute("href", "/");
    await expect(main.getByRole("link", { name: t("common.cta.viewJobs") })).toHaveAttribute("href", "/vacatures");
    await expect(main.getByRole("link", { name: t("common.cta.requestStaff") })).toHaveAttribute(
      "href",
      "/werkgevers/personeel-aanvragen",
    );
  });

  test("/bedankt/onbekend geeft 404", async ({ page }) => {
    const res = await page.goto("/bedankt/onbekend");
    expect(res?.status()).toBe(404);
  });
});

test.describe("contactpagina (AC-07-25) @readonly", () => {
  test("teamblok, gegevens en het formulier", async ({ page }) => {
    await page.goto("/contact");
    const main = page.locator("main");
    await expect(main.locator('a[href="tel:+31652549539"]').first()).toBeVisible();
    // Eén hoofdnummer op de pagina (B-60); het planningsnummer staat alleen in de footer (B-66).
    await expect(main.locator('a[href="tel:+31683351985"]')).toHaveCount(0);
    await expect(main.getByRole("heading", { level: 2, name: `${t("contact.people.title")} ${t("contact.people.accent")}` })).toBeVisible();
    // Eén WhatsApp-knop in het teamblok; de knop heeft geen eigen aria-label (B-54).
    const whatsapp = main.locator('a[href^="https://wa.me/"]');
    await expect(whatsapp).toHaveCount(1);
    await expect(whatsapp).not.toHaveAttribute("aria-label", /.*/);
    await expect(main.getByText(t("common.address.byAppointment"))).toBeVisible();
    await expect(main.locator('a[href^="mailto:"]').first()).toBeVisible();
    await expect(page.locator("section#contactformulier form")).toBeVisible();
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(main.getByRole("link", { name: t("common.cta.register") })).toHaveAttribute("href", "/inschrijven");
  });
});

test.describe("WhatsApp naast het formulier (AC-07-19) @readonly", () => {
  for (const [pad, sleutel, locale] of [
    ["/inschrijven", "common.whatsapp.werkzoekende", "nl"],
    ["/werkgevers/personeel-aanvragen", "common.whatsapp.werkgever", "nl"],
    ["/en/inschrijven", "common.whatsapp.werkzoekende", "en"],
  ] as const) {
    test(`${pad} gebruikt ${sleutel}`, async ({ page }) => {
      await page.goto(pad);
      const href = await page.locator('main aside a[href^="https://wa.me/"]').first().getAttribute("href");
      expect(decodeURIComponent(new URL(String(href)).searchParams.get("text") ?? "")).toBe(t(sleutel, { locale }));
    });
  }

  test("kruimelpaden komen uit header.nav", async ({ page }) => {
    await page.goto("/werkgevers/personeel-aanvragen");
    const crumbs = page.locator('nav[aria-label="' + t("common.breadcrumbs.label") + '"]');
    await expect(crumbs).toContainText(t("header.nav.werkgevers"));
    await expect(crumbs).toContainText(t("header.nav.personeelAanvragen"));
  });
});
