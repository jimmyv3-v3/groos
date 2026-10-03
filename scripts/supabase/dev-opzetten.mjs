#!/usr/bin/env node
/**
 * Zet het schema, de eerste beheerder en de seed op groos-dev (spec 10 §10,
 * spec 13 A4 tot en met A7, B-39, B-57). Alleen voor het ontwikkelproject.
 *
 *   npm run db:dev:opzetten
 *   npm run db:dev:opzetten -- --email <adres> --full-name "Jimmy (test)" --display-name Jimmy --phone +31683351985
 *   npm run db:dev:opzetten -- --droog      (alleen link en dry-run, schrijft niets)
 *
 * Stappen:
 *   1. SUPABASE_DB_PASSWORD uit de shell, anders uit .env.local.
 *   2. supabase link --project-ref smcskfrkjgniinbhqnln (vraagt een eerdere `supabase login`).
 *   3. supabase db push --linked --dry-run, daarna supabase db push --linked (zonder seed).
 *   4. REST-controle op /rest/v1/occupations (B-57, AC-13-05).
 *   5. Met --email: npm run db:admin met dezelfde opties (een beheerder met telefoonnummer, B-48).
 *   6. Seed: met SUPABASE_DB_URL via psql, anders met supabase db push --linked --include-seed.
 *      Alleen als er een actieve beheerder met telefoonnummer is; de seed stopt anders zelf.
 *   7. npm run db:types.
 *
 * Nooit: supabase start, db reset, db diff, db pull of config push (B-39).
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs, parseEnv } from "node:util";

const REF = "smcskfrkjgniinbhqnln";
const ROOT = join(import.meta.dirname, "..", "..");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function stap(titel) {
  console.log(`\n▸ ${titel}`);
}

/** Waarden uit .env.local zonder ze in process.env te zetten. */
function leesEnvLocal() {
  const pad = join(ROOT, ".env.local");
  return existsSync(pad) ? parseEnv(readFileSync(pad, "utf8")) : {};
}

function run(command, args, env) {
  const result = spawnSync(command, args, { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } });
  if (result.error?.code === "ENOENT") fail(`${command} ontbreekt in het PATH.`);
  return result.status === 0;
}

const { values } = parseArgs({
  options: {
    droog: { type: "boolean", default: false },
    email: { type: "string" },
    "full-name": { type: "string" },
    "display-name": { type: "string" },
    phone: { type: "string" },
    whatsapp: { type: "string" },
    role: { type: "string" },
    password: { type: "string" },
  },
});

const local = leesEnvLocal();
const dbPassword = process.env.SUPABASE_DB_PASSWORD || local.SUPABASE_DB_PASSWORD;
if (!dbPassword) {
  fail(
    "SUPABASE_DB_PASSWORD ontbreekt. Zet het databasewachtwoord van groos-dev (kluis, \"groos-dev database\") " +
      "in de shell of als regel SUPABASE_DB_PASSWORD= in .env.local, en draai dit script opnieuw.",
  );
}
const supabaseUrl = local.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl && !supabaseUrl.includes(REF)) {
  fail(`NEXT_PUBLIC_SUPABASE_URL in .env.local wijst niet naar groos-dev (${REF}). Dit script draait alleen op het ontwikkelproject.`);
}
const cli = { SUPABASE_DB_PASSWORD: dbPassword };

stap(`Koppelen aan groos-dev (${REF})`);
if (!run("supabase", ["link", "--project-ref", REF], cli)) {
  fail("supabase link mislukt. Is `supabase login` gedaan (spec 13 A0 stap 2) en klopt het wachtwoord?");
}
const refFile = join(ROOT, "supabase/.temp/project-ref");
const gekoppeld = existsSync(refFile) ? readFileSync(refFile, "utf8").trim() : "";
if (gekoppeld !== REF) fail(`supabase/.temp/project-ref geeft "${gekoppeld}" in plaats van ${REF}.`);

stap("Migraties: dry-run");
if (!run("supabase", ["db", "push", "--linked", "--dry-run"], cli)) fail("supabase db push --dry-run mislukt.");
if (values.droog) {
  console.log("\nDroog: niets toegepast.");
  process.exit(0);
}

stap("Migraties toepassen (zonder seed)");
if (!run("supabase", ["db", "push", "--linked"], cli)) fail("supabase db push mislukt.");

stap("REST-controle op occupations (B-57)");
const key = local.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (supabaseUrl && key) {
  const res = await fetch(`${supabaseUrl}/rest/v1/occupations?select=slug&order=sort_order`, { headers: { apikey: key } });
  const body = await res.text();
  console.log(body);
  if (!res.ok) {
    console.error(
      "De Data API ziet de tabellen nog niet. Zet in het dashboard onder Project Settings, Data API de Data API aan met " +
        "public in Exposed schemas en voer via de MCP `notify pgrst, 'reload schema';` uit (B-57). Daarna dit script opnieuw.",
    );
  }
} else {
  console.log("· NEXT_PUBLIC_SUPABASE_URL of de publishable key ontbreekt in .env.local; REST-controle overgeslagen.");
}

if (values.email) {
  stap("Eerste beheerder (npm run db:admin)");
  const args = ["scripts/supabase/create-admin.mjs"];
  for (const name of ["email", "full-name", "display-name", "phone", "whatsapp", "role", "password"]) {
    if (values[name]) args.push(`--${name}`, values[name]);
  }
  if (!run(process.execPath, args)) fail("db:admin mislukt; de seed is niet geladen.");
}

stap("Seed");
const dbUrl = process.env.SUPABASE_DB_URL;
const seeded = dbUrl
  ? run("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", "supabase/seed.sql"])
  : run("supabase", ["db", "push", "--linked", "--include-seed"], cli);
if (!seeded) {
  console.error(
    "Seed niet geladen. Maak eerst een beheerder met telefoonnummer: npm run db:admin -- --email <adres> " +
      "--full-name <naam> --display-name <voornaam> --phone <E.164>, en draai dit script daarna opnieuw.",
  );
}

stap("Typen (npm run db:types)");
if (!run("npm", ["run", "db:types"])) console.error("db:types mislukt; draai het later opnieuw.");

console.log("\nKlaar. Ververs de vacaturecache als de dev-server draait (B-46):");
console.log("set -a; . ./.env.local; set +a");
console.log(
  `curl -X POST -H "Authorization: Bearer $CRON_SECRET" -H 'content-type: application/json' -d '{"numbers":[],"kind":"visibility"}' http://localhost:3000/api/dev/revalidate`,
);
process.exit(seeded ? 0 : 1);
