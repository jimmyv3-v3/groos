import { describe, expect, it } from "vitest";
import { acIds, controleer, leesMatrix } from "../../../scripts/check-acceptatie.mjs";
import { budgetVoor } from "../../../scripts/check-bundles.mjs";
import { mediaan, onderDrempels } from "../../../scripts/lighthouse.mjs";

// Zuivere functies van de scripts uit spec 14 §4.5.

describe("scripts/check-bundles.mjs (spec 14 §8.5)", () => {
  it("kiest de eerste budgetklasse die past", () => {
    expect(budgetVoor("/beheer/(app)/vacatures")?.klasse).toBe("beheer");
    expect(budgetVoor("/[locale]/vacatures/[slug]")?.maxKb).toBe(235);
    expect(budgetVoor("/[locale]/contact")?.klasse).toBe("formulier");
    expect(budgetVoor("/[locale]/vacatures")?.maxKb).toBe(215);
    expect(budgetVoor("/[locale]/werken-als/[beroep]")?.maxKb).toBe(200);
    expect(budgetVoor("/api/cron/vacatures")).toBeNull();
  });
});

describe("scripts/lighthouse.mjs (spec 14 §8.4)", () => {
  const goed = { performance: 95, accessibility: 100, "best-practices": 100, seo: 100, lcpMs: 1900, cls: 0.01, tbtMs: 80 };

  it("neemt de mediaan van drie runs", () => {
    expect(mediaan([91, 88, 97])).toBe(91);
  });

  it("meldt elke meting onder de drempel", () => {
    expect(onderDrempels(goed)).toEqual([]);
    expect(onderDrempels({ ...goed, performance: 89, lcpMs: 2600, cls: 0.2, tbtMs: 250 })).toHaveLength(4);
  });
});

describe("scripts/check-acceptatie.mjs (spec 14 §11.2)", () => {
  const matrix = [
    "| AC-id | Spec | Kern | Testsoort | Bestand of protocol | Bouwstap | Status | Afgetekend |",
    "|---|---|---|---|---|---|---|---|",
    "| AC-10-17 | 10 | Zoekparameters | `unit` | tests/unit/vacatures/slug.test.ts | 1 | `groen` | |",
    "| AC-10-04 | 10 | Anon ziet open vacatures | `integratie` | tests/integration/rls.test.ts | 1 | `open` | |",
    "| AC-14-27 | 14 | Visueel protocol | `visueel` | npm run test:visueel | 9 | `open` | |",
  ].join("\n");

  it("leest id, testsoort en status uit de matrix", () => {
    expect(leesMatrix(matrix)).toEqual([
      { id: "AC-10-17", testsoort: "unit", status: "groen" },
      { id: "AC-10-04", testsoort: "integratie", status: "open" },
      { id: "AC-14-27", testsoort: "visueel", status: "open" },
    ]);
    expect(acIds("AC-10-17 en nog eens AC-10-17, plus AC-01-02")).toEqual(["AC-10-17", "AC-01-02"]);
  });

  it("meldt ontbrekende rijen, rijen zonder test, onbekende id's en open rijen bij livegang", () => {
    const uitkomst = controleer({
      specIds: ["AC-10-04", "AC-10-17", "AC-10-18", "AC-14-27"],
      rijen: leesMatrix(matrix),
      testIds: new Set(["AC-10-17", "AC-99-01"]),
      livegang: true,
    });
    expect(uitkomst.nietInMatrix).toEqual(["AC-10-18"]);
    expect(uitkomst.zonderTest).toEqual(["AC-10-04"]);
    expect(uitkomst.onbekendInTests).toEqual(["AC-99-01"]);
    expect(uitkomst.nietKlaar).toEqual(["AC-10-04 (open)", "AC-14-27 (open)"]);
  });
});
