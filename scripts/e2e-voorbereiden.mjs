// Voorbereiding van een e2e-run (spec 14 §5): bewaking, RUN_ID, cv-objecten
// weg, seed opnieuw en het beheertestaccount met TOTP. Zonder tabellen (de
// migraties staan nog niet op groos-dev) noteert het script dat; de tests die
// de database nodig hebben slaan zich dan zelf over.
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { controleerTestproject, databaseHeeftTabellen, laadEnv } from "./lib/testomgeving.mjs";

const ROOT = join(import.meta.dirname, "..");
const AUTH_DIR = join(ROOT, ".playwright-mcp/.auth");
const ACCOUNT_FILE = join(AUTH_DIR, "beheer-e2e.json");
const E2E_EMAIL = "delivered+beheer-e2e@resend.dev";

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function runId() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

async function verwijderCvObjecten(admin) {
  const { data, error } = await admin.storage.from("cvs").list("applications", { limit: 1000 });
  if (error) throw new Error(`cv-objecten ophalen mislukt: ${error.message}`);
  const paden = [];
  for (const map of data ?? []) {
    const { data: files } = await admin.storage.from("cvs").list(`applications/${map.name}`, { limit: 1000 });
    for (const f of files ?? []) paden.push(`applications/${map.name}/${f.name}`);
  }
  if (paden.length) await admin.storage.from("cvs").remove(paden);
  return paden.length;
}

async function zorgVoorBeheerAccount(admin) {
  if (existsSync(ACCOUNT_FILE)) {
    const saved = JSON.parse(readFileSync(ACCOUNT_FILE, "utf8"));
    const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (data?.users.some((u) => u.email === saved.email)) return "hergebruikt";
  }
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const oud = list?.users.find((u) => u.email === E2E_EMAIL);
  if (oud) await admin.auth.admin.deleteUser(oud.id);

  const { randomBytes } = await import("node:crypto");
  const password = randomBytes(24).toString("base64url").slice(0, 32);
  const created = await admin.auth.admin.createUser({ email: E2E_EMAIL, password, email_confirm: true });
  if (created.error) throw new Error(`beheertestaccount maken mislukt: ${created.error.message}`);
  const grant = await admin.rpc("grant_admin", {
    p_email: E2E_EMAIL,
    p_full_name: "E2E Beheer",
    p_display_name: "E2E",
    p_role: "owner",
    p_phone: "+31600000099",
  });
  if (grant.error) throw new Error(`grant_admin mislukt: ${grant.error.message}`);

  const user = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });
  const signIn = await user.auth.signInWithPassword({ email: E2E_EMAIL, password });
  if (signIn.error) throw new Error(`inloggen als e2e-beheerder mislukt: ${signIn.error.message}`);
  const enroll = await user.auth.mfa.enroll({ factorType: "totp", friendlyName: "e2e" });
  if (enroll.error) throw new Error(`TOTP koppelen mislukt: ${enroll.error.message}`);
  const secret = enroll.data.totp.secret;
  const { totp } = await import("../tests/e2e/helpers/totp.ts");
  const verify = await user.auth.mfa.challengeAndVerify({ factorId: enroll.data.id, code: totp(secret) });
  if (verify.error) throw new Error(`TOTP verifiëren mislukt: ${verify.error.message}`);
  writeFileSync(ACCOUNT_FILE, JSON.stringify({ email: E2E_EMAIL, password, totpSecret: secret }, null, 2));
  return "aangemaakt";
}

laadEnv();
try {
  controleerTestproject();
} catch (error) {
  fail(error.message);
}

mkdirSync(AUTH_DIR, { recursive: true });
const id = runId();
const tabellen = await databaseHeeftTabellen();
writeFileSync(join(AUTH_DIR, "run.json"), JSON.stringify({ runId: id, database: tabellen }, null, 2));
console.log(`E2e-voorbereiding: RUN_ID ${id}.`);

if (!tabellen) {
  console.log("· De database heeft nog geen tabellen (migraties niet toegepast). Tests die de database nodig hebben, slaan zich over.");
  process.exit(0);
}

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY ?? "", {
  auth: { persistSession: false },
});
try {
  const weg = await verwijderCvObjecten(admin);
  console.log(`· ${weg} cv-object(en) verwijderd.`);
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  if (pkg.scripts["db:seed:reset"]) {
    execSync("npm run db:seed:reset", { cwd: ROOT, stdio: "inherit" });
  } else {
    console.log("· npm run db:seed:reset bestaat nog niet (spec 10 §4.7); de seed is niet opnieuw gezet.");
  }
  console.log(`· Beheertestaccount ${await zorgVoorBeheerAccount(admin)}.`);
} catch (error) {
  fail(`${error.message} (zie de seedstap van spec 10)`);
}
