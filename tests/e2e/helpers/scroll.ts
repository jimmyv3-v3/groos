import type { Page } from "@playwright/test";

/** Scrollt de pagina door zodat reveal-secties zichtbaar zijn (spec 14 §4.3). */
export async function scrollDoor(page: Page, opties: { stapFactor?: number; pauzeMs?: number } = {}): Promise<void> {
  const { stapFactor = 0.8, pauzeMs = 150 } = opties;
  await page.evaluate(
    async ({ stapFactor, pauzeMs }) => {
      const wacht = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const stap = window.innerHeight * stapFactor;
      for (let y = 0; y < document.documentElement.scrollHeight; y += stap) {
        window.scrollTo(0, y);
        await wacht(pauzeMs);
      }
      await wacht(600);
      window.scrollTo(0, 0);
      await document.fonts.ready;
    },
    { stapFactor, pauzeMs },
  );
}
