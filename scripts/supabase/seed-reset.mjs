#!/usr/bin/env node
/**
 * Testdata legen en de seed opnieuw laden op groos-dev (spec 10 §4.7, B-46).
 * Node 24, geen extra packages. Gebruik: npm run db:seed:reset
 *
 * Leest SUPABASE_DB_URL uit de shell (nooit uit .env.local, B-51) en weigert
 * elke database die niet de ref van groos-dev bevat. Draait daarna met psql
 * supabase/seed-reset.sql en supabase/seed.sql in één aanroep.
 */
import { spawnSync } from "node:child_process";
import { join } from "node:path";

export const GROOS_DEV_REF = "smcskfrkjgniinbhqnln";

/** Melding als de URL niet naar groos-dev wijst, anders null. */
export function weigerReden(dbUrl) {
  if (!dbUrl || !dbUrl.includes(GROOS_DEV_REF)) {
    return `Seed-reset gestopt: SUPABASE_DB_URL wijst niet naar groos-dev (ref ${GROOS_DEV_REF}). Dit script draait alleen op het ontwikkelproject.`;
  }
  return null;
}

function main() {
  const dbUrl = process.env.SUPABASE_DB_URL;
  const reden = weigerReden(dbUrl);
  if (reden) {
    console.error(reden);
    process.exit(1);
  }

  const root = join(import.meta.dirname, "..", "..");
  const result = spawnSync(
    "psql",
    [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", "supabase/seed-reset.sql", "-f", "supabase/seed.sql"],
    { cwd: root, stdio: "inherit" },
  );
  if (result.error?.code === "ENOENT") {
    console.error(
      "psql ontbreekt. Draai de inhoud van supabase/seed-reset.sql en daarna supabase/seed.sql via execute_sql van de MCP (B-39).",
    );
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error("Seed-reset mislukt; zie de melding van psql hierboven.");
    process.exit(result.status ?? 1);
  }

  console.log("");
  console.log("Seed opnieuw geladen. Ververs daarna de vacaturecache (B-46).");
  console.log("Laad eerst de lokale waarden: set -a; . ./.env.local; set +a");
  console.log(
    `curl -X POST -H "Authorization: Bearer $CRON_SECRET" -H 'content-type: application/json' -d '{"numbers":[],"kind":"visibility"}' http://localhost:3000/api/dev/revalidate`,
  );
}

if (import.meta.main) main();
