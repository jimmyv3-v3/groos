#!/usr/bin/env node
/**
 * Lighthouse mobiel, mediaan van drie runs (spec 14 §4.5, §8.4 en §8.6, AC-14-15).
 *
 *   npm run build && npx next start -p 3100      (eerste terminal)
 *   npm run lighthouse                            (tweede terminal)
 *   npm run lighthouse -- --basis=http://localhost:3130 --alleen=home,beroep
 *   npm run lighthouse -- --extra=/contact,/privacyverklaring
 *
 * Poortpagina's: home, één vacature (uit de sitemap) en /werken-als/schoonmaker.
 * Pagina's uit --extra staan alleen in de tabel. Rapporten in
 * .playwright-mcp/lighthouse/<JJJJ-MM-DD>/.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";

// Drempels uit spec 14 §8.4. Strenger maken: alleen hier en in §8.4.
export const DREMPELS = { score: 90, lcpMs: 2500, cls: 0.1, tbtMs: 200 };
const CATEGORIEEN = ["performance", "accessibility", "best-practices", "seo"];
const RUNS = 3;

export function mediaan(waarden) {
  const s = [...waarden].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/** Lijst met problemen voor één pagina; leeg als alle drempels gehaald zijn. */
export function onderDrempels(m) {
  const problemen = [];
  for (const c of CATEGORIEEN) if (m[c] < DREMPELS.score) problemen.push(`${c} ${m[c]}`);
  if (m.lcpMs > DREMPELS.lcpMs) problemen.push(`LCP ${(m.lcpMs / 1000).toFixed(2)} s`);
  if (m.cls > DREMPELS.cls) problemen.push(`CLS ${m.cls.toFixed(3)}`);
  if (m.tbtMs > DREMPELS.tbtMs) problemen.push(`TBT ${Math.round(m.tbtMs)} ms`);
  return problemen;
}

async function vacaturePad(basis) {
  try {
    const xml = await (await fetch(`${basis}/sitemap.xml`)).text();
    const match = /<loc>[^<]*?(\/vacatures\/[a-z0-9-]+-\d{4,})<\/loc>/.exec(xml);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function main() {
  const { values } = parseArgs({
    options: { basis: { type: "string", default: "http://localhost:3100" }, alleen: { type: "string" }, extra: { type: "string" } },
  });
  const basis = values.basis.replace(/\/$/, "");
  const root = join(import.meta.dirname, "..");

  try {
    await fetch(basis);
  } catch {
    console.error(`✗ Geen server op ${basis}. Start eerst \`npm run build && npx next start -p 3100\` of geef --basis=<url>.`);
    process.exit(1);
  }

  const { chromium } = await import("@playwright/test");
  const env = { ...process.env, CHROME_PATH: chromium.executablePath() };

  const alleen = values.alleen?.split(",").map((s) => s.trim());
  const poort = [
    { naam: "home", pad: "/" },
    { naam: "vacature", pad: await vacaturePad(basis) },
    { naam: "beroep", pad: "/werken-als/schoonmaker" },
  ].filter((p) => !alleen || alleen.includes(p.naam));
  const extra = (values.extra?.split(",") ?? [])
    .map((p) => p.trim())
    .filter(Boolean)
    .map((pad) => ({ naam: pad.replace(/^\//, "").replace(/\//g, "__") || "root", pad, informatief: true }));

  const uit = join(root, ".playwright-mcp/lighthouse", new Date().toISOString().slice(0, 10));
  mkdirSync(uit, { recursive: true });

  let fouten = 0;
  for (const pagina of [...poort, ...extra]) {
    if (!pagina.pad) {
      console.error(`✗ ${pagina.naam}: geen vacature in ${basis}/sitemap.xml (database leeg of niet bereikbaar).`);
      fouten += 1;
      continue;
    }
    const runs = [];
    for (let run = 1; run <= RUNS; run += 1) {
      const stam = join(uit, `${pagina.naam}-${run}`);
      const result = spawnSync(
        "npx",
        [
          "--yes", "lighthouse", `${basis}${pagina.pad}`,
          "--form-factor=mobile",
          `--only-categories=${CATEGORIEEN.join(",")}`,
          "--output=json", "--output=html", `--output-path=${stam}`,
          "--chrome-flags=--headless=new", "--quiet",
        ],
        { cwd: root, env, stdio: ["ignore", "ignore", "inherit"] },
      );
      if (result.status !== 0) {
        console.error(`✗ ${pagina.naam} run ${run}: lighthouse gaf exitcode ${result.status}.`);
        continue;
      }
      const lhr = JSON.parse(readFileSync(`${stam}.report.json`, "utf8"));
      runs.push({
        ...Object.fromEntries(CATEGORIEEN.map((c) => [c, Math.round((lhr.categories[c]?.score ?? 0) * 100)])),
        lcpMs: lhr.audits["largest-contentful-paint"]?.numericValue ?? Infinity,
        cls: lhr.audits["cumulative-layout-shift"]?.numericValue ?? Infinity,
        tbtMs: lhr.audits["total-blocking-time"]?.numericValue ?? Infinity,
      });
    }
    if (runs.length === 0) {
      if (!pagina.informatief) fouten += 1;
      continue;
    }
    const m = Object.fromEntries(Object.keys(runs[0]).map((k) => [k, mediaan(runs.map((r) => r[k]))]));
    const problemen = onderDrempels(m);
    const mislukt = !pagina.informatief && (problemen.length > 0 || runs.length < RUNS);
    if (mislukt) fouten += 1;
    console.log(
      `${pagina.informatief ? "·" : mislukt ? "✗" : "✓"} ${pagina.naam.padEnd(24)} perf ${m.performance}  a11y ${m.accessibility}  bp ${m["best-practices"]}  seo ${m.seo}  ` +
        `LCP ${(m.lcpMs / 1000).toFixed(2)} s  CLS ${m.cls.toFixed(3)}  TBT ${Math.round(m.tbtMs)} ms` +
        (problemen.length ? `  onder de drempel: ${problemen.join(", ")}` : "") +
        (pagina.informatief ? "  (informatief)" : ""),
    );
  }

  console.log(`\nRapporten in ${uit.slice(root.length + 1)}/`);
  process.exit(fouten > 0 ? 1 : 0);
}

if (import.meta.main) await main();
