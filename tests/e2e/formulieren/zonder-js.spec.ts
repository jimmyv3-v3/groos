import { expect, test } from "@playwright/test";
import { t } from "../helpers/messages";

// Progressive enhancement (AC-07-12): zonder JavaScript valideert de server.
// Een lege inzending raakt de database niet, dus deze test kan altijd draaien.
// Lokaal en in e2e werkt dit volledig; op productie weigert BotID een
// inzending zonder JavaScript (B-36).

test.use({ javaScriptEnabled: false });

// Zonder JavaScript lopen er geen animatieframes in de pagina, waardoor de
// stabiliteitscontrole van Playwright nooit klaar is. De velden staan stil,
// dus klikken zonder die controle is hier veilig.
const KLIK = { force: true } as const;

test.describe("formulieren zonder JavaScript @readonly", () => {
  test("lege inschrijving: serverfouten, waarden blijven staan, autofocus op het eerste veld", async ({ page }) => {
    await page.goto("/inschrijven");
    const form = page.locator("main form").first();
    await expect(form.getByText(t("forms.jobseeker.cv.noJs"))).toBeVisible();
    await expect(form.locator('input[type="file"]')).toHaveCount(0);
    await form.locator('input[name="city"]').fill("Den Haag");
    await form.locator('button[type="submit"]').click(KLIK);
    await page.waitForLoadState("load");

    await expect(form.locator('input[name="firstName"]')).toHaveAttribute("aria-invalid", "true");
    await expect(form.locator('input[name="firstName"]')).toHaveAttribute("autofocus", "");
    await expect(form.getByText(t("forms.jobseeker.errors.firstNameRequired"))).toBeVisible();
    await expect(form.getByText(t("forms.jobseeker.errors.phoneRequired"))).toBeVisible();
    await expect(form.getByText(t("forms.privacy.registerConsent.error"))).toBeVisible();
    await expect(form.locator('input[name="city"]')).toHaveValue("Den Haag");
  });

  test("contact zonder telefoon en e-mail: reachRequired bij beide velden", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("section#contactformulier form");
    await form.locator('input[name="name"]').fill("Test Bezoeker");
    await form.locator('input[name="topic"][value="other"]').check(KLIK);
    await form.locator('textarea[name="message"]').fill("Een vraag");
    await form.locator('button[type="submit"]').click(KLIK);
    await page.waitForLoadState("load");
    await expect(form.locator('input[name="phone"]')).toHaveAttribute("aria-invalid", "true");
    await expect(form.locator('input[name="email"]')).toHaveAttribute("aria-invalid", "true");
    await expect(form.getByText(t("forms.contactForm.errors.reachRequired"))).toHaveCount(2);
  });
});
