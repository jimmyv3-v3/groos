import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Axe met WCAG 2.2 AA; uitsluitingen alleen met reden (spec 14 §4.3). */
export async function verwachtGeenAxeBevindingen(page: Page, opties: { uitsluiten?: string[] } = {}): Promise<void> {
  let builder = new AxeBuilder({ page }).withTags(TAGS);
  for (const selector of opties.uitsluiten ?? []) builder = builder.exclude(selector);
  const { violations } = await builder.analyze();
  const samenvatting = violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
  }));
  expect(samenvatting, JSON.stringify(samenvatting, null, 2)).toEqual([]);
}

/** Koppen in documentvolgorde. */
export async function koppen(page: Page): Promise<{ niveau: number; tekst: string }[]> {
  return page.$$eval("h1, h2, h3, h4, h5, h6", (els) =>
    els.map((el) => ({ niveau: Number(el.tagName.slice(1)), tekst: (el.textContent ?? "").trim() })),
  );
}
