#!/usr/bin/env node
/**
 * Livegang-check. Draai met `npm run check` (of `npm run check -- --warn` om
 * alleen te waarschuwen). Controleert:
 *  1. dat messages/nl.json en messages/en.json exact dezelfde sleutels hebben
 *     (en arrays dezelfde lengte, want iconen worden op index gekoppeld);
 *  2. dat elke dienst en stad volledig is geregistreerd;
 *  3. dat er geen placeholders meer in de site staan (TODO, example.nl, ...);
 *  4. dat verplichte bestanden bestaan (logo voor de JSON-LD, .env.local).
 * Exitcode 1 bij problemen, zodat het als poort vóór livegang dient.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const WARN_ONLY = process.argv.includes("--warn");
const problems = [];
const notes = [];

// 1. Sleutelpariteit nl/en ---------------------------------------------------
function shape(value, path = "", out = new Map()) {
  if (Array.isArray(value)) {
    out.set(path, `array(${value.length})`);
    value.forEach((v, i) => shape(v, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) shape(v, path ? `${path}.${k}` : k, out);
  } else {
    out.set(path, "leaf");
  }
  return out;
}

const messagesDir = join(ROOT, "messages");
const locales = readdirSync(messagesDir).filter((f) => f.endsWith(".json"));
const shapes = Object.fromEntries(
  locales.map((f) => [f, shape(JSON.parse(readFileSync(join(messagesDir, f), "utf8")))]),
);
const [base, ...others] = locales;
for (const other of others) {
  for (const [key, kind] of shapes[base]) {
    const otherKind = shapes[other].get(key);
    if (otherKind === undefined) problems.push(`messages/${other}: sleutel ontbreekt: ${key}`);
    else if (otherKind !== kind) problems.push(`messages/${other}: ${key} is ${otherKind}, in ${base} ${kind}`);
  }
  for (const key of shapes[other].keys()) {
    if (!shapes[base].has(key)) problems.push(`messages/${base}: sleutel ontbreekt: ${key}`);
  }
}

// 2. Registratie van diensten en steden ---------------------------------------
const servicesIndex = readFileSync(join(ROOT, "content/services/index.ts"), "utf8");
const servicePages = readFileSync(join(ROOT, "content/services/pages.ts"), "utf8");
const slugs = [...servicesIndex.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const nlMessages = JSON.parse(readFileSync(join(messagesDir, "nl.json"), "utf8"));
for (const slug of slugs) {
  if (!servicePages.includes(`"${slug}"`)) problems.push(`content/services/pages.ts: dienst "${slug}" niet geregistreerd`);
  for (const f of locales) {
    const m = JSON.parse(readFileSync(join(messagesDir, f), "utf8"));
    if (!m.services?.[slug]?.title) problems.push(`messages/${f}: services.${slug}.title ontbreekt`);
  }
}
for (const key of Object.keys(nlMessages.services ?? {})) {
  if (!slugs.includes(key)) notes.push(`messages: services.${key} hoort bij geen enkele dienst (verwijderen?)`);
}

// 3. Placeholders --------------------------------------------------------------
const MARKERS = [
  [/\bTODO\b/, "TODO"],
  [/www\.example\.nl|info@example\.nl/, "example.nl"],
  [/00000000/, "nummer 00000000"],
  [/\b(dienst|stad)-(een|twee|drie|vier)\b/, "voorbeeld-slug"],
];
const SCAN = ["app", "components", "content", "lib", "messages", "i18n", "proxy.ts"];
const counts = new Map();

function scan(path) {
  const full = join(ROOT, path);
  if (!existsSync(full)) return;
  if (statSync(full).isDirectory()) {
    for (const entry of readdirSync(full)) scan(join(path, entry));
    return;
  }
  if (!/\.(tsx?|json|css)$/.test(full)) return;
  const lines = readFileSync(full, "utf8").split("\n");
  lines.forEach((line) => {
    for (const [re, label] of MARKERS) {
      if (re.test(line)) {
        const key = `${relative(ROOT, full)}`;
        const entry = counts.get(key) ?? {};
        entry[label] = (entry[label] ?? 0) + 1;
        counts.set(key, entry);
      }
    }
  });
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
  problems.push(`${file}: ${summary}`);
}

// 4. Verplichte bestanden --------------------------------------------------------
if (!existsSync(join(ROOT, "public/brand/logo.png"))) problems.push("public/brand/logo.png ontbreekt (logo voor de JSON-LD, zie lib/site.ts)");
if (!existsSync(join(ROOT, ".env.local"))) notes.push(".env.local ontbreekt; het formulier werkt lokaal pas met NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY");

// Rapport ---------------------------------------------------------------------------
console.log(`\nLivegang-check: ${problems.length} punt(en), waarvan ${placeholderTotal} placeholder-regels.\n`);
for (const p of problems) console.log(`  ✗ ${p}`);
for (const n of notes) console.log(`  · ${n}`);
if (problems.length === 0) console.log("  ✓ Alles in orde.");
console.log("");
process.exit(problems.length > 0 && !WARN_ONLY ? 1 : 0);
