import { expect, test } from "@playwright/test";
import { S } from "@/app/beheer/_strings";

test.describe("beheer zonder sessie @readonly", () => {
  test("/beheer stuurt door naar de inlogpagina", async ({ page }) => {
    await page.goto("/beheer");
    await expect(page).toHaveURL(/\/beheer\/inloggen\?volgende=%2Fbeheer$/);
    await expect(page.getByRole("heading", { level: 1, name: S.auth.login.title })).toBeVisible();
  });

  test("inlogpagina: noindex, Nederlands en de juiste autocomplete", async ({ page }) => {
    const res = await page.goto("/beheer/inloggen");
    expect(res?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.locator("html")).toHaveAttribute("lang", "nl");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("autocomplete", "username");
    await expect(page.locator('input[name="password"]')).toHaveAttribute("autocomplete", "current-password");
  });

  test("manifest valt binnen de scope", async ({ request }) => {
    const manifest = (await (await request.get("/beheer/manifest.webmanifest")).json()) as { start_url: string; scope: string };
    expect(manifest.start_url.startsWith(manifest.scope)).toBe(true);
  });
});
