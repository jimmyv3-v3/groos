// Gedeelde bewaking voor testscripts en tests (spec 14 §5.2). Schrijft nooit
// iets; weigert elk Supabase-project dat niet in tests/e2e/toegestane-projecten.json staat.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..", "..");

/** Laadt .env.local als die er is (Node 24: process.loadEnvFile). */
export function laadEnv() {
  try {
    process.loadEnvFile(join(ROOT, ".env.local"));
  } catch {
    // Geen .env.local: dan alleen variabelen uit de shell.
  }
}

/** Projectref uit https://<ref>.supabase.co, of null. */
export function projectRef(url) {
  const match = /^https:\/\/([a-z0-9]+)\.supabase\.co\/?$/.exec(url ?? "");
  return match ? match[1] : null;
}

/** Stopt met een fout als de URL niet naar een toegestaan testproject wijst. */
export function controleerTestproject(url = process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const toegestaan = JSON.parse(readFileSync(join(ROOT, "tests/e2e/toegestane-projecten.json"), "utf8")).supabaseProjectRefs;
  const ref = projectRef(url);
  if (!ref || !toegestaan.includes(ref)) {
    throw new Error(`Testomgeving geweigerd: project ${ref ?? url ?? "(leeg)"} staat niet in tests/e2e/toegestane-projecten.json`);
  }
  return ref;
}

/**
 * Of de tabellen van spec 10 bestaan. Zolang de migraties niet zijn toegepast
 * geeft PostgREST PGRST205; tests die de database nodig hebben slaan zich dan over.
 */
export async function databaseHeeftTabellen() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  try {
    const res = await fetch(`${url}/rest/v1/public_vacancies?select=id&limit=1`, { headers: { apikey: key } });
    return res.ok;
  } catch {
    return false;
  }
}
