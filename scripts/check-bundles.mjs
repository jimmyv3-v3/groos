#!/usr/bin/env node
/**
 * JavaScript-budget per route (spec 14 §4.5 en §8.5, AC-14-16) en de controle
 * dat er geen geheimen in de clientbundle staan (AC-13-11).
 *
 *   npm run build && npm run check:bundles
 *   npm run check:bundles -- --warn     (altijd exit 0)
 *
 * Leest .next/diagnostics/route-bundle-stats.json (geschreven door `next build`
 * met Turbopack in Next 16.3) en de bestanden in .next/static.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

// Budgetten in kB gzip. De eerste klasse die past, telt. Verhogen alleen samen
// met spec 14 §8.5.
export const BUDGETTEN = [
  { klasse: "beheer", patroon: /^\/beheer/, maxKb: 350, alleenWaarschuwing: true },
  {
    klasse: "formulier",
    patroon: /^\/\[locale\]\/(vacatures\/\[slug\]|inschrijven|contact|werkgevers\/personeel-aanvragen)$/,
    maxKb: 235,
  },
  { klasse: "vacatureoverzicht", patroon: /^\/\[locale\]\/vacatures$/, maxKb: 215 },
  { klasse: "inhoud", patroon: /^\/\[locale\]/, maxKb: 200, doelKb: 170 },
];
export const CSS_MAX_KB = 35;

// sb_secret_ (Supabase secret key) en re_ gevolgd door een sleutel (Resend).
const GEHEIMEN = [
  { naam: "Supabase secret key", patroon: /sb_secret_[A-Za-z0-9_-]{8,}/ },
  { naam: "Resend-sleutel", patroon: /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}/ },
];

export function budgetVoor(route) {
  return BUDGETTEN.find((b) => b.patroon.test(route)) ?? null;
}

function alleBestanden(map) {
  if (!existsSync(map)) return [];
  return readdirSync(map, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile())
    .map((e) => join(e.parentPath, e.name));
}

function main() {
  const root = join(import.meta.dirname, "..");
  const warn = process.argv.includes("--warn");
  const statsPad = join(root, ".next/diagnostics/route-bundle-stats.json");
  if (!existsSync(statsPad)) {
    console.error(
      "✗ .next/diagnostics/route-bundle-stats.json ontbreekt. Draai eerst `npm run build`. " +
        "Schrijft deze Next-versie het bestand niet meer, meet dan met `npx next experimental-analyze --output`.",
    );
    process.exit(warn ? 0 : 1);
  }

  const gzipCache = new Map();
  const gzipBytes = (pad) => {
    if (!gzipCache.has(pad)) {
      const vol = join(root, pad);
      gzipCache.set(pad, existsSync(vol) ? gzipSync(readFileSync(vol)).length : 0);
    }
    return gzipCache.get(pad);
  };

  const stats = JSON.parse(readFileSync(statsPad, "utf8"));
  const rijen = stats
    .map((s) => {
      const kb = s.firstLoadChunkPaths.reduce((som, pad) => som + gzipBytes(pad), 0) / 1000;
      return { route: s.route, kb, budget: budgetVoor(s.route) };
    })
    .sort((a, b) => a.route.localeCompare(b.route));

  let fouten = 0;
  const breedte = Math.max(...rijen.map((r) => r.route.length), 5);
  console.log(`${"  Route".padEnd(breedte)}  ${"gzip".padStart(9)}  ${"budget".padStart(8)}  klasse`);
  for (const r of rijen) {
    let teken = "·";
    let notitie = "";
    if (r.budget) {
      if (r.kb > r.budget.maxKb) {
        teken = r.budget.alleenWaarschuwing ? "!" : "✗";
        if (!r.budget.alleenWaarschuwing) fouten += 1;
        notitie = r.budget.alleenWaarschuwing ? " (waarschuwing)" : " (boven budget)";
      } else {
        teken = "✓";
        if (r.budget.doelKb && r.kb > r.budget.doelKb) notitie = ` (boven doel ${r.budget.doelKb} kB)`;
      }
    }
    const budget = r.budget ? `${r.budget.maxKb} kB` : "geen";
    console.log(
      `${teken} ${r.route.padEnd(breedte - 2)}  ${`${r.kb.toFixed(1)} kB`.padStart(9)}  ${budget.padStart(8)}  ${r.budget?.klasse ?? ""}${notitie}`,
    );
  }

  const statisch = alleBestanden(join(root, ".next/static"));
  const cssKb = statisch.filter((f) => f.endsWith(".css")).reduce((som, f) => som + gzipSync(readFileSync(f)).length, 0) / 1000;
  console.log(`\nCSS samen: ${cssKb.toFixed(1)} kB gzip (richtwaarde ${CSS_MAX_KB} kB)${cssKb > CSS_MAX_KB ? " · boven de richtwaarde" : ""}`);

  for (const bestand of statisch.filter((f) => /\.(js|css|json|map|txt|html)$/.test(f))) {
    const inhoud = readFileSync(bestand, "utf8");
    for (const g of GEHEIMEN) {
      if (g.patroon.test(inhoud)) {
        fouten += 1;
        console.error(`✗ ${g.naam} gevonden in ${bestand.slice(root.length + 1)} (AC-13-11)`);
      }
    }
  }

  console.log(fouten === 0 ? "\nBundelcontrole: binnen de budgetten, geen geheimen in .next/static." : `\nBundelcontrole: ${fouten} probleem/problemen.`);
  process.exit(fouten > 0 && !warn ? 1 : 0);
}

if (import.meta.main) main();
