#!/usr/bin/env node
/**
 * Livegang-check (spec 14 §10.2). Draai met `npm run check`, `npm run check --
 * --warn` (alleen waarschuwen, altijd exit 0) of `npm run check -- --json`.
 * Regels in deze versie (bouwstap 3):
 *  K1  sleutelpariteit messages/nl/*.json en messages/en/*.json (zelfde
 *      bestanden, sleutels, soorten en arraylengtes), geen lege waarden, geen
 *      vervallen namespaces (services, werkgebied, service, beheer);
 *  K2  beroepenregister: content/beroepen/index.ts bevat precies de vijf
 *      beroepen met beide slugs (00 §4.2) en per id de beroepsnamen in messages;
 *      content/beroepen/<id>.ts is een notitie tot spec 05 ze levert;
 *  K3  verwijderlijst van spec 01;
 *  K4  placeholders (TODO, example.nl, example.com, 00000000, lorem ipsum,
 *      voorbeeldslugs); TODO's in lib/claims.ts telt K6;
 *  K5  copyregels via scripts/check-copy.mjs (notitie zolang het script ontbreekt);
 *  K6  open claims in lib/claims.ts (notitie);
 *  K7  geen "Wilk", "Versseput" of "jversseput" in sitetekst;
 *  K8  verplichte bestanden;
 *  K11 de proxy-matcher sluit api, beheer en feeds uit;
 *  K12 elke page.tsx onder app/[locale] gebruikt pageMetadata( en geen openGraph:;
 *  K13 geen next/link in app/[locale] en components (behalve components/beheer).
 * K9, K10, K14 en K15 volgen in de stap van spec 14.
 * Exitcode 1 bij problemen, zodat het als poort vóór livegang dient.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const WARN_ONLY = process.argv.includes("--warn");
const JSON_OUT = process.argv.includes("--json");
const problems = [];
const notes = [];
const problem = (rule, text) => problems.push({ rule, text });
const note = (rule, text) => notes.push({ rule, text });
const read = (path) => readFileSync(join(ROOT, path), "utf8");
const exists = (path) => existsSync(join(ROOT, path));

// K1. Sleutelpariteit nl/en per namespace-bestand -----------------------------
function shape(value, path, out) {
  if (Array.isArray(value)) {
    out.set(path, `array(${value.length})`);
    value.forEach((v, i) => shape(v, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) shape(v, path ? `${path}.${k}` : k, out);
  } else {
    out.set(path, typeof value === "string" && value.trim() === "" ? "empty" : "leaf");
  }
  return out;
}

const MESSAGES = "messages";
const locales = readdirSync(join(ROOT, MESSAGES)).filter((f) => statSync(join(ROOT, MESSAGES, f)).isDirectory()).sort();
const namespacesOf = (locale) =>
  readdirSync(join(ROOT, MESSAGES, locale))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
const messages = Object.fromEntries(
  locales.map((l) => [l, Object.fromEntries(namespacesOf(l).map((ns) => [ns, JSON.parse(read(`${MESSAGES}/${l}/${ns}.json`))]))]),
);
const base = locales.includes("nl") ? "nl" : locales[0];
for (const locale of locales) {
  for (const ns of Object.keys(messages[locale])) {
    const flat = shape(messages[locale][ns], ns, new Map());
    for (const [key, kind] of flat) if (kind === "empty") problem("K1", `messages/${locale}/${ns}.json: lege waarde: ${key}`);
    if (["services", "werkgebied", "service", "beheer"].includes(ns)) problem("K1", `messages/${locale}/${ns}.json: vervallen namespace`);
    if (!new RegExp(`import ${ns} from "./${ns}.json"`).test(read(`${MESSAGES}/${locale}/index.ts`))) {
      problem("K1", `messages/${locale}/index.ts: namespace ${ns} niet geïmporteerd`);
    }
  }
}
for (const other of locales.filter((l) => l !== base)) {
  const all = new Set([...Object.keys(messages[base]), ...Object.keys(messages[other])]);
  for (const ns of all) {
    if (!messages[other][ns]) { problem("K1", `messages/${other}/${ns}.json ontbreekt`); continue; }
    if (!messages[base][ns]) { problem("K1", `messages/${base}/${ns}.json ontbreekt`); continue; }
    const a = shape(messages[base][ns], ns, new Map());
    const b = shape(messages[other][ns], ns, new Map());
    for (const [key, kind] of a) {
      const otherKind = b.get(key);
      if (otherKind === undefined) problem("K1", `messages/${other}/${ns}.json: sleutel ontbreekt: ${key}`);
      else if (otherKind.startsWith("array") !== kind.startsWith("array") || (kind.startsWith("array") && otherKind !== kind)) {
        problem("K1", `messages/${other}/${ns}.json: ${key} is ${otherKind}, in ${base} ${kind}`);
      }
    }
    for (const key of b.keys()) if (!a.has(key)) problem("K1", `messages/${base}/${ns}.json: sleutel ontbreekt: ${key}`);
  }
}

// K2. Beroepenregister ---------------------------------------------------------
const VERWACHTE_BEROEPEN = {
  glazenwasser: ["glazenwasser", "glazenwassers"],
  schoonmaker: ["schoonmaker", "schoonmakers"],
  "logistiek-medewerker": ["logistiek-medewerker", "logistiek-medewerkers"],
  verhuizer: ["verhuizer", "verhuizers"],
  "hulpkracht-bouw-en-sloop": ["hulpkracht-bouw-en-sloop", "hulpkrachten-bouw-en-sloop"],
};
const BEROEP_SLEUTELS = ["enkelvoud", "meervoud"];
if (!exists("content/beroepen/index.ts")) {
  problem("K2", "content/beroepen/index.ts ontbreekt");
} else {
  const register = read("content/beroepen/index.ts");
  const found = [...register.matchAll(/id:\s*"([^"]+)",\s*slugWerkzoekende:\s*"([^"]+)",\s*slugWerkgever:\s*"([^"]+)"/g)].map((m) => m.slice(1));
  const ids = found.map(([id]) => id);
  for (const [id, [sz, sw]] of Object.entries(VERWACHTE_BEROEPEN)) {
    const entry = found.find(([fid]) => fid === id);
    if (!entry) problem("K2", `content/beroepen/index.ts: beroep "${id}" ontbreekt`);
    else if (entry[1] !== sz || entry[2] !== sw) problem("K2", `content/beroepen/index.ts: slugs van "${id}" wijken af van 00 §4.2 (${sz}, ${sw})`);
    for (const locale of locales) {
      for (const key of BEROEP_SLEUTELS) {
        if (!messages[locale].beroepen?.[id]?.[key]) problem("K2", `messages/${locale}/beroepen.json: ${id}.${key} ontbreekt`);
      }
    }
    if (!exists(`content/beroepen/${id}.ts`)) note("K2", `content/beroepen/${id}.ts ontbreekt nog (spec 05, bouwstap 4)`);
  }
  for (const id of ids) if (!(id in VERWACHTE_BEROEPEN)) problem("K2", `content/beroepen/index.ts: onverwacht beroep "${id}"`);
}

// K3. Verwijderlijst van spec 01 ----------------------------------------------------
for (const path of [
  "content/services",
  "content/werkgebied",
  "components/werkgebied",
  "app/[locale]/diensten",
  "app/[locale]/werkgebied",
  "app/[locale]/privacybeleid",
  "components/ui/button.tsx",
  "components/sections/offerte-form.tsx",
]) {
  if (exists(path)) problem("K3", `${path} hoort verwijderd te zijn (spec 01 §4.10)`);
}

// K4. Placeholders --------------------------------------------------------------------
const MARKERS = [
  [/\bTODO\b/, "TODO"],
  [/www\.example\.(nl|com)|@example\.(nl|com)/, "example.nl/com"],
  [/00000000/, "nummer 00000000"],
  [/lorem ipsum/i, "lorem ipsum"],
  [/\b(dienst|stad)-(een|twee|drie|vier)\b/, "voorbeeld-slug"],
];
const SCAN = ["app", "components", "content", "lib", "messages", "i18n", "emails", "proxy.ts"];
const counts = new Map();
function scan(path) {
  const full = join(ROOT, path);
  if (!existsSync(full)) return;
  if (statSync(full).isDirectory()) {
    for (const entry of readdirSync(full)) scan(join(path, entry));
    return;
  }
  if (!/\.(tsx?|json|css)$/.test(full) || path === join("lib", "claims.ts")) return;
  for (const line of readFileSync(full, "utf8").split("\n")) {
    for (const [re, label] of MARKERS) {
      if (!re.test(line)) continue;
      const entry = counts.get(path) ?? {};
      entry[label] = (entry[label] ?? 0) + 1;
      counts.set(path, entry);
    }
  }
}
SCAN.forEach(scan);
let placeholderTotal = 0;
for (const [file, entry] of [...counts].sort()) {
  const summary = Object.entries(entry)
    .map(([label, n]) => {
      placeholderTotal += n;
      return `${n}× ${label}`;
    })
    .join(", ");
  problem("K4", `${relative(ROOT, join(ROOT, file))}: ${summary}`);
}

// K5. Copyregels (spec 03) ----------------------------------------------------------------
if (!exists("scripts/check-copy.mjs")) {
  note("K5", "scripts/check-copy.mjs bestaat nog niet (spec 03); copyregels niet gecontroleerd");
} else {
  const run = spawnSync(process.execPath, ["scripts/check-copy.mjs"], { cwd: ROOT, encoding: "utf8" });
  if (run.status === 1) problem("K5", `check-copy meldt fouten:\n${run.stdout.split("\n").slice(0, 6).join("\n")}`);
}

// K6. Open claims ----------------------------------------------------------------------------
if (exists("lib/claims.ts")) {
  const open = read("lib/claims.ts").split("\n").filter((l) => /\bTODO\b/.test(l) && /:\s*false/.test(l)).length;
  if (open > 0) note("K6", `lib/claims.ts: ${open} open claims`);
}
if (!exists("scripts/check-claims.mjs")) note("K6", "scripts/check-claims.mjs bestaat nog niet (spec 09)");

// K7. Geen namen van J. Versseput of Wilk in sitetekst ---------------------------------------
const K7_SCAN = ["messages", "content", "lib/site.ts", "emails", "app/[locale]/privacyverklaring", "app/[locale]/cookieverklaring", "app/[locale]/algemene-voorwaarden", "app/[locale]/klachtenregeling"];
function scanNames(path) {
  const full = join(ROOT, path);
  if (!existsSync(full)) return;
  if (statSync(full).isDirectory()) return readdirSync(full).forEach((e) => scanNames(join(path, e)));
  if (/\b(wilk|versseput|jversseput)\b/i.test(readFileSync(full, "utf8"))) problem("K7", `${path}: noemt Wilk of (J.) Versseput`);
}
K7_SCAN.forEach(scanNames);

// K8. Verplichte bestanden -------------------------------------------------------------------
const siteSource = exists("lib/site.ts") ? read("lib/site.ts") : "";
const logo = siteSource.match(/logo:\s*"([^"]+)"/)?.[1];
if (logo && !exists(join("public", logo))) problem("K8", `public${logo} ontbreekt (site.logo in lib/site.ts)`);
for (const path of [
  "app/[locale]/not-found.tsx",
  "app/[locale]/error.tsx",
  "app/global-error.tsx",
  "app/global-not-found.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "app/llms.txt/route.ts",
  "lib/routes.ts",
  "content/beroepen/index.ts",
  "supabase/seed.sql",
  ".env.example",
]) {
  if (!exists(path)) problem("K8", `${path} ontbreekt`);
}
if (!exists("app/icon.tsx") && !exists("app/icon.png") && !exists("app/icon.svg")) problem("K8", "app/icon ontbreekt");
if (!exists("vercel.ts") && !exists("vercel.json")) problem("K8", "vercel.ts of vercel.json ontbreekt");
if (!exists("supabase/migrations") || readdirSync(join(ROOT, "supabase/migrations")).length === 0) problem("K8", "geen migraties in supabase/migrations");
if (!exists("app/beheer/_strings.ts")) note("K8", "app/beheer/_strings.ts ontbreekt nog (spec 08, bouwstap 7)");
if (!exists(".env.local")) note("K8", ".env.local ontbreekt; zie .env.example en spec 13 §5.1");

// K11. Proxy-uitsluitingen -------------------------------------------------------------------
if (exists("proxy.ts")) {
  const matcher = read("proxy.ts").match(/matcher:\s*\[([\s\S]*?)\]/)?.[1] ?? "";
  const first = matcher.match(/"([^"]*)"/)?.[1] ?? "";
  for (const prefix of ["api", "beheer"]) {
    if (!first.includes(`(?!`) || !new RegExp(`[(!|]${prefix}[|)]`).test(first)) problem("K11", `proxy.ts: matcher sluit "${prefix}" niet uit`);
  }
  if (!/[(!|]feeds[|)]/.test(first)) note("K11", "proxy.ts: matcher sluit \"feeds\" nog niet uit (fase 2)");
}

// K12 en K13. Pagina's en links ------------------------------------------------------------
function walk(dir, out = []) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return out;
  for (const entry of readdirSync(full)) {
    const path = join(dir, entry);
    if (statSync(join(ROOT, path)).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}
for (const file of walk("app/[locale]").filter((f) => f.endsWith("page.tsx"))) {
  const src = read(file);
  // Vangnet en de stijlgids (alleen ontwikkeling, spec 02) hebben geen paginametadata nodig.
  if (/\/\[\.\.\.rest\]\/|\/stijlgids\//.test(file)) continue;
  if (!src.includes("pageMetadata(")) problem("K12", `${file}: geen pageMetadata(`);
  if (/openGraph\s*:/.test(src)) problem("K12", `${file}: los openGraph-object`);
}
for (const file of [...walk("app/[locale]"), ...walk("components")].filter((f) => /\.tsx?$/.test(f) && !f.startsWith(join("components", "beheer")))) {
  if (/from\s+["']next\/link["']/.test(read(file))) problem("K13", `${file}: importeert next/link (gebruik Link uit @/i18n/navigation)`);
}

// Rapport -----------------------------------------------------------------------------------
if (JSON_OUT) {
  console.log(JSON.stringify({ problems, notes, placeholderTotal }, null, 2));
} else {
  console.log(`\nLivegang-check: ${problems.length} punt(en), waarvan ${placeholderTotal} placeholder-regels.\n`);
  for (const p of problems) console.log(`  ✗ [${p.rule}] ${p.text}`);
  for (const n of notes) console.log(`  · [${n.rule}] ${n.text}`);
  if (problems.length === 0) console.log("  ✓ Alles in orde.");
  console.log("");
}
process.exit(problems.length > 0 && !WARN_ONLY ? 1 : 0);
