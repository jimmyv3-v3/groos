#!/usr/bin/env node
/**
 * Livegang-check (spec 14 §10.2). Draai met `npm run check`, `npm run check --
 * --warn` (alleen waarschuwen, altijd exit 0) of `npm run check -- --json`.
 * Regels:
 *  K1  sleutelpariteit messages/nl/*.json en messages/en/*.json, geen lege
 *      waarden, geen vervallen namespaces;
 *  K2  beroepenregister (00 §4.2) en per id content en beroepsnamen;
 *  K3  verwijderlijst van spec 01;
 *  K4  placeholders (TODO, example.nl/com, 00000000, lorem ipsum, voorbeeldslugs);
 *      uitzonderingen met reden in scripts/check-launch.uitzonderingen.json;
 *  K5  copyregels via scripts/check-copy.mjs (spec 03);
 *  K6  open claims in lib/claims.ts en scripts/check-claims.mjs --strict (spec 09);
 *  K7  geen "Wilk", "Versseput" of "jversseput" in sitetekst;
 *  K8  verplichte bestanden;
 *  K9  omgevingsvariabelen in .env.example (00 §4.5, spec 13 §5.1);
 *  K10 geen gevolgde .env-bestanden en geen sb_secret_ in gevolgde bestanden;
 *  K11 proxy-matcher en /beheer-tak (B-38);
 *  K12 paginametadata via pageMetadata(, vacancyMetadata( of vacancyListMetadata(;
 *  K13 geen next/link buiten het beheer;
 *  K14 kleuren alleen via tokens;
 *  K15 juridische pagina's en content/pages met een nl- en een en-blok.
 * Exitcode 1 bij problemen, zodat het als poort vóór livegang dient.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, sep } from "node:path";

const ROOT = process.cwd();
const WARN_ONLY = process.argv.includes("--warn");
const JSON_OUT = process.argv.includes("--json");
const problems = [];
const notes = [];
const problem = (rule, text) => problems.push({ rule, text });
const note = (rule, text) => notes.push({ rule, text });
const read = (path) => readFileSync(join(ROOT, path), "utf8");
const exists = (path) => existsSync(join(ROOT, path));
const toPosix = (p) => p.split(sep).join("/");

function walk(dir, out = []) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return out;
  if (statSync(full).isFile()) return [dir];
  for (const entry of readdirSync(full)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const path = join(dir, entry);
    if (statSync(join(ROOT, path)).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

// Uitzonderingen met reden (spec 14 §6.2) ------------------------------------------------
const EXCEPTIONS = exists("scripts/check-launch.uitzonderingen.json")
  ? JSON.parse(read("scripts/check-launch.uitzonderingen.json"))
  : [];
for (const e of EXCEPTIONS) {
  if (!e.regel || !e.bestand || !e.patroon || !e.reden || !e.bevestigdDoor || !e.datum) {
    problem("K4", `scripts/check-launch.uitzonderingen.json: onvolledige uitzondering ${JSON.stringify(e)}`);
  }
}
const excepted = (rule, file, line) =>
  EXCEPTIONS.some((e) => e.regel === rule && toPosix(file) === e.bestand && line.includes(e.patroon));

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
const locales = exists(MESSAGES)
  ? readdirSync(join(ROOT, MESSAGES)).filter((f) => statSync(join(ROOT, MESSAGES, f)).isDirectory()).sort()
  : [];
if (!locales.length) problem("K1", "messages/<taal>/ ontbreekt");
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
  const index = exists(`${MESSAGES}/${locale}/index.ts`) ? read(`${MESSAGES}/${locale}/index.ts`) : "";
  for (const ns of Object.keys(messages[locale])) {
    const flat = shape(messages[locale][ns], ns, new Map());
    for (const [key, kind] of flat) if (kind === "empty") problem("K1", `messages/${locale}/${ns}.json: lege waarde: ${key}`);
    if (["services", "werkgebied", "service", "beheer"].includes(ns)) problem("K1", `messages/${locale}/${ns}.json: vervallen namespace`);
    if (!new RegExp(`import ${ns} from "./${ns}.json"`).test(index)) {
      problem("K1", `messages/${locale}/index.ts: namespace ${ns} niet geïmporteerd`);
    }
  }
}
for (const other of locales.filter((l) => l !== base)) {
  const all = new Set([...Object.keys(messages[base]), ...Object.keys(messages[other])]);
  for (const ns of all) {
    if (!messages[other][ns]) {
      problem("K1", `messages/${other}/${ns}.json ontbreekt`);
      continue;
    }
    if (!messages[base][ns]) {
      problem("K1", `messages/${base}/${ns}.json ontbreekt`);
      continue;
    }
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
    if (!exists(`content/beroepen/${id}.ts`)) problem("K2", `content/beroepen/${id}.ts ontbreekt`);
    else if (!/\bnl:\s*\{/.test(read(`content/beroepen/${id}.ts`)) || !/\ben:\s*\{/.test(read(`content/beroepen/${id}.ts`))) {
      problem("K2", `content/beroepen/${id}.ts: nl- of en-blok ontbreekt`);
    }
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
  [/www\.example\.(nl|com)|@example\.(nl|com)|\bexample\.com\b/, "example.nl/com"],
  [/00000000/, "nummer 00000000"],
  [/lorem ipsum/i, "lorem ipsum"],
  [/\b(dienst|stad)-(een|twee|drie|vier)\b/, "voorbeeld-slug"],
];
const SCAN = ["app", "components", "content", "lib", "messages", "i18n", "emails", "proxy.ts"];
const counts = new Map();
for (const file of SCAN.flatMap((p) => walk(p))) {
  if (!/\.(tsx?|json|css)$/.test(file) || toPosix(file) === "lib/claims.ts") continue;
  for (const line of read(file).split("\n")) {
    for (const [re, label] of MARKERS) {
      if (!re.test(line) || excepted("K4", file, line)) continue;
      const entry = counts.get(file) ?? {};
      entry[label] = (entry[label] ?? 0) + 1;
      counts.set(file, entry);
    }
  }
}
let placeholderTotal = 0;
for (const [file, entry] of [...counts].sort()) {
  const summary = Object.entries(entry)
    .map(([label, n]) => {
      placeholderTotal += n;
      return `${n}× ${label}`;
    })
    .join(", ");
  problem("K4", `${toPosix(file)}: ${summary}`);
}

// K5. Copyregels (spec 03) ----------------------------------------------------------------
if (!exists("scripts/check-copy.mjs")) {
  note("K5", "scripts/check-copy.mjs bestaat nog niet (spec 03); copyregels niet gecontroleerd");
} else {
  const run = spawnSync(process.execPath, ["scripts/check-copy.mjs", "--json"], { cwd: ROOT, encoding: "utf8" });
  let result = null;
  try {
    result = JSON.parse(run.stdout);
  } catch {
    // Script zonder --json (bijvoorbeeld een stub): val terug op de exitcode.
  }
  const line = (f) => `[${f.rule}] ${f.where}: ${f.message}`;
  if (result) {
    if (result.errors.length) {
      problem("K5", `check-copy: ${result.errors.length} fout(en)\n      ${result.errors.slice(0, 5).map(line).join("\n      ")}`);
    }
    if (result.warnings.length) {
      note("K5", `check-copy: ${result.warnings.length} waarschuwing(en), onder meer\n      ${result.warnings.slice(0, 5).map(line).join("\n      ")}`);
    }
  } else if (run.status !== 0) {
    problem("K5", `check-copy meldt fouten:\n${(run.stdout || run.stderr).split("\n").slice(0, 6).join("\n")}`);
  }
}

// K6. Claims (spec 03 §6.11, spec 09) --------------------------------------------------------
if (exists("lib/claims.ts")) {
  const open = read("lib/claims.ts").split("\n").filter((l) => /\bTODO\b/.test(l)).length;
  if (open > 0) note("K6", `lib/claims.ts: ${open} open claims`);
}
if (!exists("scripts/check-claims.mjs")) {
  note("K6", "scripts/check-claims.mjs bestaat nog niet (spec 09)");
} else {
  const run = spawnSync(process.execPath, ["scripts/check-claims.mjs", "--strict"], { cwd: ROOT, encoding: "utf8" });
  if (run.status !== 0) {
    problem("K6", `check-claims --strict meldt blokkerende treffers:\n${(run.stdout || run.stderr).trim().split("\n").slice(-6).join("\n")}`);
  }
}

// K7. Geen namen van J. Versseput of Wilk in sitetekst ---------------------------------------
const K7_SCAN = [
  "messages",
  "content",
  "lib/site.ts",
  "emails",
  "app/[locale]/privacyverklaring",
  "app/[locale]/cookieverklaring",
  "app/[locale]/algemene-voorwaarden",
  "app/[locale]/klachtenregeling",
];
for (const file of K7_SCAN.flatMap((p) => walk(p))) {
  if (/\b(wilk|versseput|jversseput)\b/i.test(read(file))) problem("K7", `${toPosix(file)}: noemt Wilk of (J.) Versseput`);
}

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
  "app/beheer/_strings.ts",
  "content/beroepen/index.ts",
  "supabase/seed.sql",
  ".env.example",
  "playwright.config.ts",
  "vitest.config.mts",
]) {
  if (!exists(path)) problem("K8", `${path} ontbreekt`);
}
if (!exists("app/icon.tsx") && !exists("app/icon.png") && !exists("app/icon.svg")) problem("K8", "app/icon ontbreekt");
if (!exists("vercel.ts") && !exists("vercel.json")) problem("K8", "vercel.ts of vercel.json ontbreekt");
if (!exists("supabase/migrations") || readdirSync(join(ROOT, "supabase/migrations")).length === 0) problem("K8", "geen migraties in supabase/migrations");
if (!exists(".env.local")) note("K8", ".env.local ontbreekt; zie .env.example en spec 13 §5.1");

// K9. Omgevingsvariabelen (00 §4.5, spec 13 §5.1, AC-13-12) ---------------------------------
const VASTE_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "RESEND_API_KEY",
  "CRON_SECRET",
  "RESEND_WEBHOOK_SECRET",
];
const SYSTEEM_ENV = new Set(["NODE_ENV", "VERCEL", "VERCEL_ENV", "VERCEL_URL", "NEXT_RUNTIME"]);
if (exists(".env.example")) {
  const example = read(".env.example");
  const lines = example.split("\n");
  const active = new Set(lines.map((l) => l.match(/^([A-Z][A-Z0-9_]*)=/)?.[1]).filter(Boolean));
  const mentioned = new Set(lines.map((l) => l.match(/^#?\s*([A-Z][A-Z0-9_]*)=/)?.[1]).filter(Boolean));
  for (const name of VASTE_ENV) if (!active.has(name)) problem("K9", `.env.example: ${name}= ontbreekt (00 §4.5)`);
  const ENV_SCAN = ["app", "components", "lib", "emails", "i18n", "proxy.ts", "instrumentation-client.ts", "next.config.mjs"];
  const used = new Set();
  for (const file of ENV_SCAN.flatMap((p) => walk(p))) {
    if (!/\.(tsx?|mjs|js)$/.test(file)) continue;
    for (const m of read(file).matchAll(/process\.env\.([A-Z][A-Z0-9_]*[A-Z0-9])\b/g)) used.add(m[1]);
  }
  for (const name of [...used].sort()) {
    if (!SYSTEEM_ENV.has(name) && !mentioned.has(name)) problem("K9", `process.env.${name} staat niet in .env.example (AC-13-12)`);
  }
}
for (const file of [".env.example", ...["app", "components", "lib", "emails"].flatMap((p) => walk(p))]) {
  if (exists(file) && statSync(join(ROOT, file)).isFile() && /web3forms/i.test(read(file))) problem("K9", `${toPosix(file)}: noemt Web3Forms (B-13)`);
}

// K10. Geheimen (spec 13, F5) -----------------------------------------------------------------
const git = spawnSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
if (git.status === 0) {
  const tracked = git.stdout.split("\n").filter(Boolean);
  for (const file of tracked) {
    if (/(^|\/)\.env(\..*)?$/.test(file) && file !== ".env.example") problem("K10", `${file} staat in git`);
  }
  const grep = spawnSync("git", ["grep", "-l", "sb_secret_[A-Za-z0-9]"], { cwd: ROOT, encoding: "utf8" });
  for (const file of grep.stdout.split("\n").filter(Boolean)) problem("K10", `${file} bevat een sleutel die met sb_secret_ begint`);
} else {
  note("K10", "geen git-repository; gevolgde bestanden niet gecontroleerd");
}

// K11. Proxy (B-38) ----------------------------------------------------------------------------
if (exists("proxy.ts")) {
  const src = read("proxy.ts");
  const matcher = src.match(/matcher:\s*\[([\s\S]*?)\]\s*,?\s*\}/)?.[1] ?? src.match(/matcher:\s*\[([\s\S]*?)\]/)?.[1] ?? "";
  const entries = [...matcher.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
  const first = entries[0] ?? "";
  for (const prefix of ["api", "beheer", "feeds", "149e9513-01fa-4fb0-aad4-566afd725d1b"]) {
    if (!first.includes("(?!") || !new RegExp(`[(!|]${prefix.replace(/-/g, "\\-")}[|)]`).test(first)) {
      problem("K11", `proxy.ts: eerste matcher sluit "${prefix}" niet uit`);
    }
  }
  if (entries[1] !== "/beheer/:path*") problem("K11", `proxy.ts: tweede matcher is niet exact "/beheer/:path*"`);
  // De if-regel met "/beheer" tot en met de eerste puntkomma of het eerste blok.
  const ifAt = src.search(/if\s*\([^\n]*["']\/beheer["']/);
  const beheerBranch = ifAt < 0 ? "" : src.slice(ifAt).match(/^[^\n]*?\)\s*(return\s+[^;]+;|\{[\s\S]*?\n\s*\})/)?.[1] ?? "";
  if (!/beheerProxy\(/.test(beheerBranch)) problem("K11", "proxy.ts: /beheer gaat niet alleen naar beheerProxy()");
  if (/intlMiddleware|createMiddleware|NEXT_LOCALE|COOKIE/.test(beheerBranch)) {
    problem("K11", "proxy.ts: de /beheer-tak gebruikt next-intl of zet NEXT_LOCALE");
  }
}

// K12 en K13. Pagina's en links ------------------------------------------------------------
for (const file of walk("app/[locale]").filter((f) => f.endsWith("page.tsx"))) {
  const src = read(file);
  // Vangnet en de stijlgids (alleen ontwikkeling, spec 02) hebben geen paginametadata nodig.
  if (/\/\[\.\.\.rest\]\/|\/stijlgids\//.test(toPosix(file))) continue;
  if (!/\b(pageMetadata|vacancyMetadata|vacancyListMetadata)\(/.test(src)) problem("K12", `${toPosix(file)}: geen pageMetadata(`);
  if (/openGraph\s*:/.test(src)) problem("K12", `${toPosix(file)}: los openGraph-object`);
}
for (const file of [...walk("app/[locale]"), ...walk("components")].filter((f) => /\.tsx?$/.test(f) && !toPosix(f).startsWith("components/beheer/"))) {
  if (/from\s+["']next\/link["']/.test(read(file))) problem("K13", `${toPosix(file)}: importeert next/link (gebruik Link uit @/i18n/navigation)`);
}

// K14. Kleuren alleen via tokens --------------------------------------------------------------
const K14_EXEMPT = [
  /^app\/globals\.css$/,
  /^app\/icon\.tsx$/,
  /^app\/apple-icon\.tsx$/,
  /^app\/(.*\/)?opengraph-image\.tsx$/,
  /^app\/(.*\/)?twitter-image\.tsx$/,
  /^components\/brand\//,
];
for (const file of [...walk("app"), ...walk("components")].filter((f) => /\.tsx?$/.test(f))) {
  const rel = toPosix(file);
  if (K14_EXEMPT.some((re) => re.test(rel))) continue;
  read(file)
    .split("\n")
    .forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      if (/(?<![\w&/])#[0-9a-fA-F]{3,8}\b(?![\w-])/.test(line.replace(/href=["'][^"']*["']|["']#(?=[\w-]*[g-zG-Z_-])[\w-]+["']/g, "")) || /\b(rgba?|hsla?|oklch)\(/.test(line)) {
        problem("K14", `${rel}:${i + 1}: kleurwaarde buiten de tokens`);
      }
    });
}

// K15. nl- en en-blokken (B-03) ----------------------------------------------------------------
for (const page of ["privacyverklaring", "cookieverklaring", "algemene-voorwaarden", "klachtenregeling"]) {
  const file = `app/[locale]/${page}/page.tsx`;
  if (!exists(file)) continue;
  const src = read(file);
  const block = src.slice(src.indexOf("const CONTENT"));
  if (!src.includes("const CONTENT") || !/\bnl:\s*\{/.test(block) || !/\ben:\s*\{/.test(block)) {
    problem("K15", `${file}: CONTENT mist een nl- of en-blok`);
  }
}
for (const file of walk("content/pages").filter((f) => f.endsWith(".ts"))) {
  const src = read(file);
  if (!/export const \w+Page\b/.test(src)) continue;
  if (!/\bnl:\s*\{/.test(src) || !/\ben:\s*\{/.test(src)) problem("K15", `${toPosix(file)}: nl- of en-blok ontbreekt`);
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
