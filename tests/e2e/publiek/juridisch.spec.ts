import { expect, test } from "@playwright/test";
import { contact } from "@/lib/site";
import { WTTA, getLegalDoc, publishedLegalDocs } from "@/lib/legal";
import { verwachtGeenAxeBevindingen } from "../helpers/a11y";
import { scrollDoor } from "../helpers/scroll";
import { t } from "../helpers/messages";

// Juridische pagina's en wettelijke vermeldingen (spec 09 §11). Geen database nodig.

const ANKERS = ["solliciteren", "inschrijven", "opdrachtgevers", "berichten", "website", "bewaartermijnen", "rechten"];
const VOORRANG = "This is a translation of the Dutch text. If the two versions differ, the Dutch version applies.";

test.describe("juridische pagina's @readonly", () => {
  for (const [url, titel] of [
    ["/privacyverklaring", "Privacyverklaring"],
    ["/en/privacyverklaring", "Privacy statement"],
  ] as const) {
    test(`${url}: 17 genummerde artikelen, ankers en kruimelpad (AC-09-01)`, async ({ page }) => {
      const res = await page.goto(url);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveText(titel);
      const h2 = page.locator("main article > h2");
      await expect(h2).toHaveCount(17);
      for (let i = 0; i < 17; i++) await expect(h2.nth(i)).toHaveText(new RegExp(`^${i + 1}\\. `));
      for (const id of ANKERS) await expect(page.locator(`article#${id}`)).toHaveCount(1);
      const locale = url.startsWith("/en") ? "en" : "nl";
      const kruimelpad = page.getByRole("navigation", { name: t("common.breadcrumbs.label", { locale }) });
      await expect(kruimelpad).toContainText(t("common.breadcrumbs.home", { locale }));
      await expect(kruimelpad.getByRole("link").first()).toBeVisible();
      await expect(kruimelpad).toContainText(titel);
    });
  }

  test("privacyverklaring noemt verwerkers, termijnen en een klikbaar e-mailadres (AC-09-02, AC-09-03)", async ({ page }) => {
    await page.goto("/privacyverklaring");
    const main = page.locator("main");
    for (const woord of ["Supabase", "Frankfurt", "Vercel", "BotID", "Web Analytics", "Resend", "STRATO", "Data Privacy Framework", "Autoriteit Persoonsgegevens", "binnen een maand"]) {
      await expect(main).toContainText(woord);
    }
    await expect(main.locator(`a[href="mailto:${contact.email}"]`).first()).toBeVisible();
    await expect(page.locator("#bewaartermijnen tbody tr")).toHaveCount(11);
    // Artikel 4 belooft geen vraag na acht weken (spec 09 §12, uitleg B-07).
    await expect(page.locator("#inschrijven")).not.toContainText("acht weken");
  });

  test("cookieverklaring heeft de cookietabel (AC-09-04)", async ({ page }) => {
    const res = await page.goto("/cookieverklaring");
    expect(res?.status()).toBe(200);
    await expect(page.locator("caption", { hasText: "Cookies op deze website" })).toBeVisible();
    await expect(page.locator("main article > h2")).toHaveCount(8);
  });

  test("klachtenregeling: negen artikelen, vijf werkdagen en de behandelaars (AC-09-06)", async ({ page }) => {
    const res = await page.goto("/klachtenregeling");
    expect(res?.status()).toBe(200);
    const h2 = page.locator("main article > h2");
    await expect(h2).toHaveCount(9);
    for (let i = 0; i < 9; i++) await expect(h2.nth(i)).toHaveText(new RegExp(`^Artikel ${i + 1}\\. `));
    const main = page.locator("main");
    for (const woord of ["vijf werkdagen", "Jimmy", "Lorenzo"]) await expect(main).toContainText(woord);
  });

  test("algemene voorwaarden: noindex, niet in de sitemap en nergens gelinkt (AC-09-07)", async ({ page, request }) => {
    test.skip(getLegalDoc("terms").published, "voorwaarden zijn gepubliceerd");
    const html = await (await request.get("/algemene-voorwaarden")).text();
    expect(html).toMatch(/<meta name="robots" content="noindex, follow"\/?>/);
    const sitemap = await request.get("/sitemap.xml");
    if (sitemap.ok()) expect(await sitemap.text()).not.toContain("algemene-voorwaarden");
    for (const url of ["/", "/werkgevers", "/contact", "/en"]) {
      await page.goto(url);
      await expect(page.locator('a[href$="/algemene-voorwaarden"]')).toHaveCount(0);
    }
  });

  test("versieregel en conceptmelding (AC-09-20)", async ({ page }) => {
    for (const [url, doc] of [
      ["/privacyverklaring", "privacy"],
      ["/cookieverklaring", "cookies"],
      ["/klachtenregeling", "complaints"],
    ] as const) {
      const meta = getLegalDoc(doc);
      await page.goto(url);
      await expect(page.locator("main")).toContainText(`Versie ${meta.version}, bijgewerkt op 2 oktober 2026.`);
      if (meta.draft) await expect(page.locator("main")).toContainText(t("legal.draftNotice"));
    }
  });

  test("Engelse intro's zeggen dat de Nederlandse tekst voorgaat (AC-09-21)", async ({ page }) => {
    for (const url of ["/en/privacyverklaring", "/en/cookieverklaring", "/en/klachtenregeling"]) {
      await page.goto(url);
      await expect(page.locator("main header p").first()).toHaveText(new RegExp(`${VOORRANG.replace(/\./g, "\\.")}$`));
    }
  });

  test("/privacybeleid bestaat niet meer (AC-09-27)", async ({ request }) => {
    expect((await request.get("/privacybeleid")).status()).toBe(404);
  });
});

test.describe("inhoudsopgave (AC-09-19) @readonly", () => {
  test("1280 px: rechts, sticky en met aria-current na een klik", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/privacyverklaring");
    const toc = page.locator("aside").getByRole("navigation", { name: t("legal.toc.ariaLabel") });
    await expect(toc).toBeVisible();
    const link = toc.getByRole("link", { name: /Hoe lang wij gegevens bewaren/ });
    await link.click();
    await expect(page).toHaveURL(/#bewaartermijnen$/);
    const kop = page.locator("#bewaartermijnen h2");
    await expect(kop).toBeInViewport();
    const box = await kop.boundingBox();
    expect(box?.y ?? 0).toBeGreaterThanOrEqual(64);
    await expect(link).toHaveAttribute("aria-current", "location");
    await expect(toc).toBeInViewport();
  });

  test("390 px: ingeklapt boven de artikelen, zonder horizontale scroll @mobiel", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/privacyverklaring");
    const details = page.locator("main details").first();
    await expect(details).toBeVisible();
    await expect(details).not.toHaveAttribute("open", "");
    await expect(page.locator("aside nav")).toBeHidden();
    const breed = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(breed).toBeLessThanOrEqual(0);
  });
});

test.describe("footer met wettelijke vermeldingen (AC-09-10, AC-09-11) @readonly @smoke", () => {
  for (const url of ["/", "/werkgevers", "/contact", "/en"]) {
    test(`${url}: naam, adres, e-mail, Wtta-regel en juridische links`, async ({ page }) => {
      await page.goto(url);
      const footer = page.locator("footer");
      for (const tekst of [contact.name, contact.street, `${contact.postalCode} ${contact.city}`, contact.email]) {
        await expect(footer).toContainText(tekst);
      }
      // KvK en btw verschijnen pas als ze in lib/site.ts staan; tot dan faalt AC-09-10 bewust bij de livegang-check.
      if (contact.kvk) await expect(footer).toContainText(/KvK \d{8}|Chamber of Commerce \d{8}/);
      if (contact.btw) await expect(footer).toContainText(/NL\d{9}B\d{2}/);
      const locale = url.startsWith("/en") ? "en" : "nl";
      const nav = footer.getByRole("navigation", { name: t("legal.footer.ariaLabel", { locale }) });
      for (const doc of publishedLegalDocs()) {
        const href = locale === "en" ? `/en${doc.path}` : doc.path;
        await expect(nav.locator(`a[href="${href}"]`)).toHaveText(t(`legal.nav.${doc.id}`, { locale }));
      }
      // Met WTTA op "preparing" (lib/legal.ts) de footerregel met een link naar /werkgevers/wtta.
      if (WTTA.phase !== "preparing") return;
      await expect(footer).toContainText(t("legal.wtta.footer.preparing", { locale }));
      const wtta = footer.getByRole("link", { name: t("legal.wtta.infoLink", { locale }) });
      await expect(wtta).toHaveAttribute("href", locale === "en" ? "/en/werkgevers/wtta" : "/werkgevers/wtta");
    });
  }
});

test.describe("axe op de cookieverklaring (AC-09-22) @a11y @readonly @mobiel", () => {
  test("/cookieverklaring heeft geen axe-bevindingen", async ({ page }) => {
    await page.goto("/cookieverklaring");
    await scrollDoor(page);
    await verwachtGeenAxeBevindingen(page, { uitsluiten: ["nextjs-portal"] });
  });
});
