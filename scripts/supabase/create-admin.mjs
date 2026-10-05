#!/usr/bin/env node
/**
 * Eerste beheerder aanmaken of bijwerken (spec 10 §4.7). Node 24, geen extra
 * packages buiten de app-dependencies.
 *
 *   npm run db:admin -- --email <adres> --full-name "Jimmy (test)" --display-name Jimmy \
 *     --phone +31683351985 [--whatsapp +31683351985] [--role owner|recruiter] [--password <min 12 tekens>]
 *
 * Leest .env.local (NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SECRET_KEY), maakt de
 * gebruiker aan als die nog niet bestaat (bevestigd, met wachtwoord) en roept
 * daarna grant_admin aan. Zonder --password wordt een wachtwoord van 20 tekens
 * gemaakt en één keer getoond.
 */
import { randomBytes } from "node:crypto";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";

const E164 = /^\+[1-9][0-9]{7,14}$/;

function fail(message) {
  console.error(`Fout: ${message}`);
  process.exit(1);
}

try {
  process.loadEnvFile(".env.local");
} catch {
  fail(".env.local niet gevonden. Draai dit script vanuit de root van de repo.");
}

const { values } = parseArgs({
  options: {
    email: { type: "string" },
    "full-name": { type: "string" },
    "display-name": { type: "string" },
    phone: { type: "string" },
    whatsapp: { type: "string" },
    role: { type: "string", default: "owner" },
    password: { type: "string" },
  },
});

const email = values.email?.trim().toLowerCase();
const fullName = values["full-name"]?.trim();
const displayName = values["display-name"]?.trim();
const phone = values.phone?.trim() || null;
const whatsapp = values.whatsapp?.trim() || null;
const role = values.role;

if (!email || !email.includes("@")) fail("--email ontbreekt of is ongeldig.");
if (!fullName) fail("--full-name ontbreekt.");
if (!displayName || displayName.length > 40) fail("--display-name ontbreekt of is langer dan 40 tekens.");
// Een publiceerbare vacature heeft een contactpersoon met telefoonnummer (B-48).
if (!phone) fail("--phone ontbreekt. Elke beheerder krijgt een telefoonnummer in E.164, bijvoorbeeld +31683351985 (B-48).");
if (!E164.test(phone)) fail("--phone moet in E.164 staan, bijvoorbeeld +31683351985.");
if (whatsapp && !E164.test(whatsapp)) fail("--whatsapp moet in E.164 staan, bijvoorbeeld +31683351985.");
if (role !== "owner" && role !== "recruiter") fail("--role is owner of recruiter.");
if (values.password && values.password.length < 12) fail("--password moet minimaal 12 tekens hebben.");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url) fail("NEXT_PUBLIC_SUPABASE_URL ontbreekt in .env.local.");
if (!secretKey?.startsWith("sb_secret_")) fail("SUPABASE_SECRET_KEY ontbreekt of begint niet met sb_secret_.");

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

async function findUserByEmail(address) {
  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) fail(`gebruikers ophalen mislukt: ${error.message}`);
    const match = data.users.find((u) => u.email?.toLowerCase() === address);
    if (match) return match;
    if (data.users.length < 200) return null;
  }
  return null;
}

let generatedPassword = null;
let user = await findUserByEmail(email);
if (user) {
  console.log(`Gebruiker ${email} bestaat al; het wachtwoord blijft ongewijzigd.`);
} else {
  const password = values.password ?? randomBytes(15).toString("base64url").slice(0, 20);
  if (!values.password) generatedPassword = password;
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) fail(`gebruiker aanmaken mislukt: ${error?.message ?? "onbekend"}`);
  user = data.user;
  console.log(`Gebruiker ${email} aangemaakt.`);
}

const { data: profileId, error: grantError } = await supabase.rpc("grant_admin", {
  p_email: email,
  p_full_name: fullName,
  p_display_name: displayName,
  p_role: role,
  p_phone: phone,
  p_whatsapp: whatsapp,
});
if (grantError) fail(`grant_admin mislukt: ${grantError.message}`);

console.log(`Beheerprofiel ${profileId} staat klaar (rol ${role}).`);
if (generatedPassword) {
  console.log("");
  console.log(`Wachtwoord (wordt maar één keer getoond, bewaar het in de kluis): ${generatedPassword}`);
}
console.log("");
console.log(
  "Inloggen op /beheer gaat met e-mailadres en wachtwoord. Een authenticator-app koppelen is " +
    "optioneel en kan op /beheer/mfa/koppelen (B-62).",
);
