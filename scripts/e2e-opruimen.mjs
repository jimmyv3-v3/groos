// Verwijdert alle e2e-data uit groos-dev (spec 14 §5.5). Zonder tabellen is er niets op te ruimen.
import { createClient } from "@supabase/supabase-js";
import { controleerTestproject, databaseHeeftTabellen, laadEnv } from "./lib/testomgeving.mjs";

laadEnv();
try {
  controleerTestproject();
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}

if (!(await databaseHeeftTabellen())) {
  console.log("E2e-opruimen: de database heeft nog geen tabellen; niets op te ruimen.");
  process.exit(0);
}

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY ?? "", {
  auth: { persistSession: false },
});
const E2E_EMAIL = "delivered+e2e-%";

const { data: cvRows } = await admin.from("applications").select("cv_path").like("email", E2E_EMAIL).not("cv_path", "is", null);
const cvPaths = (cvRows ?? []).map((r) => r.cv_path).filter(Boolean);
if (cvPaths.length) await admin.storage.from("cvs").remove(cvPaths);
console.log(`cvs: ${cvPaths.length} object(en) verwijderd`);

for (const table of ["applications", "staff_requests", "contact_messages"]) {
  const { count, error } = await admin.from(table).delete({ count: "exact" }).like("email", E2E_EMAIL);
  if (error) console.error(`✗ ${table}: ${error.message}`);
  else console.log(`${table}: ${count ?? 0} rij(en) verwijderd`);
}

const { data: vacs } = await admin.from("vacancy_translations").select("vacancy_id").like("title", "E2E %");
const ids = [...new Set((vacs ?? []).map((v) => v.vacancy_id))];
if (ids.length) {
  const { error } = await admin.from("vacancies").delete().in("id", ids);
  if (error) console.error(`✗ vacancies: ${error.message}`);
}
console.log(`vacancies: ${ids.length} testvacature(s) verwijderd`);
