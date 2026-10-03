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

  test("secties in de volgorde van §4.2 en §4.3 (AC-05-03)", async ({ page }) => {
    const ids = async () =>
      page.locator("main section[id]").evaluateAll((els) => els.map((el) => el.id).filter((id) => id !== ""));
    await page.goto(paths.werkenAls("glazenwasser"));
    expect(await ids()).toEqual(
      ["werk", "eisen", "loon", "werktijden", "certificaten", "waarom", "doorgroei", "vacatures", "solliciteren", "faq", "aan-de-slag"],
    );
    await page.goto(paths.werkgeverBeroep("glazenwasser"));
    expect(await ids()).toEqual(["levering", "waarom", "certificaten", "planning", "werkwijze", "zekerheid", "faq", "aanvragen"]);
  });

  test("loonindicatie met bedrag, badge, peildatum en voorbehoud (AC-05-07)", async ({ page }) => {
    await page.goto(paths.werkenAls("schoonmaker"));
    const loon = page.locator("#loon");
    await expect(loon).toContainText(/€\s15,52 tot €\s16,08 bruto per uur/);
    await expect(loon).toContainText(t("beroepen.ui.wage.badge"));
    await expect(loon).toContainText(t("beroepen.ui.wage.rangeLabel"));
    await expect(loon).toContainText("Gecontroleerd op 2 oktober 2026");
    await expect(loon).toContainText("Dit is een indicatie en geen loonbelofte.");
    await page.goto(`/en${paths.werkenAls("schoonmaker")}`);
    await expect(page.locator("#loon")).toContainText(/€15\.52 to €16\.08 gross per hour/);
    await expect(page.locator("#loon")).toContainText("Checked on 2 October 2026");
  });

  test("belknop op werkgeverspagina's begint met het zichtbare label (B-54)", async ({ page }) => {
    for (const url of ["/werkgevers", paths.werkgeverBeroep("verhuizer")]) {
      await page.goto(url);
      const knop = page.locator('main a[href^="tel:"]').first();
      await expect(knop).toContainText(t("common.cta.call"));
      await expect(knop).toHaveAccessibleName(new RegExp(`^${t("common.cta.call")}`));
    }
  });

  test("werkgevers toont zonder bevestigde claims alleen de twee vaste punten in #wat-wij-leveren", async ({ page }) => {
    await page.goto("/werkgevers");
    await expect(page.locator("#wat-wij-leveren h3")).toHaveCount(2);
  });

  test("groeipad zonder 'voorman' (VR-01)", async ({ page }) => {
    for (const b of beroepen) {
      await page.goto(paths.werkenAls(b.id));
      await expect(page.locator("#doorgroei ol li")).not.toHaveCount(0);
      await expect(page.locator("main")).not.toContainText(/voorman/i);
    }
  });

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
