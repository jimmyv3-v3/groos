#!/usr/bin/env node
/**
 * Acceptatiematrix tegen specs en tests (spec 14 §4.5 en §11.2, AC-14-30).
 *
 *   npm run check:acceptatie
 *   npm run check:acceptatie -- --livegang   (elke rij groen, afgetekend of vervallen)
 *
 * Meldt: AC-id's uit spec 01 tot en met 14 die niet in de matrix staan,
 * automatische rijen zonder test met dat id, tests met een onbekend id en met
 * --livegang elke rij met een andere status dan groen, afgetekend of vervallen.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const AC = /AC-(\d{2})-(\d{2,3}[a-z]?)/g;
const AUTOMATISCH = ["unit", "integratie", "e2e", "e2e-ro", "a11y"];
const KLAAR = ["groen", "afgetekend", "vervallen"];
const MATRIX = "docs/acceptatie/acceptatiematrix.md";

/** Unieke AC-id's in een tekst. */
export function acIds(tekst) {
  return [...new Set([...tekst.matchAll(AC)].map((m) => m[0]))];
}

/** Rijen van deel 1 van de matrix: | AC-id | Spec | Kern | Testsoort | Bestand | Bouwstap | Status | Afgetekend |. */
export function leesMatrix(markdown) {
  const rijen = [];
  for (const regel of markdown.split("\n")) {
    const cellen = regel.split("|").map((c) => c.trim());
    if (cellen.length < 9 || !/^AC-\d{2}-\d{2,3}[a-z]?$/.test(cellen[1])) continue;
    rijen.push({ id: cellen[1], testsoort: cellen[4].replaceAll("`", ""), status: cellen[7].replaceAll("`", "") });
  }
  return rijen;
}

/** Problemen per soort; alle lijsten leeg als de matrix klopt. */
export function controleer({ specIds, rijen, testIds, livegang }) {
  const inMatrix = new Set(rijen.map((r) => r.id));
  const bekend = new Set(specIds);
  return {
    nietInMatrix: specIds.filter((id) => !inMatrix.has(id)),
    zonderTest: rijen
      .filter((r) => r.status !== "vervallen" && r.testsoort.split(/\s+en\s+|,\s*/).some((s) => AUTOMATISCH.includes(s)))
      .filter((r) => !testIds.has(r.id))
      .map((r) => r.id),
    onbekendInTests: [...testIds].filter((id) => !bekend.has(id)),
    nietKlaar: livegang ? rijen.filter((r) => !KLAAR.includes(r.status)).map((r) => `${r.id} (${r.status || "leeg"})`) : [],
  };
}

function main() {
  const root = join(import.meta.dirname, "..");
  const livegang = process.argv.includes("--livegang");

  const specs = readdirSync(join(root, "docs/specs")).filter((f) => /^(0[1-9]|1[0-4])-.*\.md$/.test(f));
  const specIds = [...new Set(specs.flatMap((f) => acIds(readFileSync(join(root, "docs/specs", f), "utf8"))))]
    // Alleen id's van de spec zelf of van een andere spec in de matrix van fase 1.
    .filter((id) => /^AC-(0[1-9]|1[0-4])-/.test(id))
    .sort();

  if (!existsSync(join(root, MATRIX))) {
    console.error(`✗ ${MATRIX} ontbreekt (spec 14 §10.1 stap 6). ${specIds.length} AC-id's uit de specs hebben nog geen rij.`);
    process.exit(1);
  }
  const rijen = leesMatrix(readFileSync(join(root, MATRIX), "utf8"));

  const testIds = new Set(
    readdirSync(join(root, "tests"), { withFileTypes: true, recursive: true })
      .filter((e) => e.isFile() && e.name.endsWith(".ts"))
      .flatMap((e) => acIds(readFileSync(join(e.parentPath, e.name), "utf8"))),
  );

  const p = controleer({ specIds, rijen, testIds, livegang });
  const meld = (titel, lijst) => {
    if (lijst.length === 0) return;
    console.error(`✗ ${titel} (${lijst.length}): ${lijst.join(", ")}`);
  };
  meld("AC-id's die niet in de matrix staan", p.nietInMatrix);
  meld("Automatische rijen zonder test met dat id", p.zonderTest);
  meld("Tests met een onbekend AC-id", p.onbekendInTests);
  meld("Rijen die niet groen, afgetekend of vervallen zijn", p.nietKlaar);

  const totaal = p.nietInMatrix.length + p.zonderTest.length + p.onbekendInTests.length + p.nietKlaar.length;
  console.log(`Acceptatiematrix: ${rijen.length} rij(en), ${specIds.length} AC-id's in de specs, ${totaal} punt(en).`);
  process.exit(totaal > 0 ? 1 : 0);
}

if (import.meta.main) main();
