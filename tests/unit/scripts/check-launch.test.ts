import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterAll, describe, it } from "vitest";

// Mini-repo's per regel (spec 14 §10.2): het script draait met --json in een
// tijdelijke map en de test kijkt alleen naar de regel die hij toetst.
const SCRIPT = join(process.cwd(), "scripts/check-launch.mjs");
const dirs: string[] = [];

type Result = { problems: { rule: string; text: string }[]; notes: { rule: string; text: string }[] };

function run(files: Record<string, string>, opts: { git?: boolean } = {}): Result {
  const dir = mkdtempSync(join(tmpdir(), "check-launch-"));
  dirs.push(dir);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  if (opts.git) {
    spawnSync("git", ["init", "-q"], { cwd: dir });
    spawnSync("git", ["add", "-A"], { cwd: dir });
  }
  const res = spawnSync(process.execPath, [SCRIPT, "--json"], { cwd: dir, encoding: "utf8" });
  return JSON.parse(res.stdout) as Result;
}

const rule = (r: Result, id: string) => r.problems.filter((p) => p.rule === id);

afterAll(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
});

const ENV_OK = [
  "NEXT_PUBLIC_SUPABASE_URL=",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=",
  "SUPABASE_SECRET_KEY=",
  "RESEND_API_KEY=",
  "CRON_SECRET=",
  "RESEND_WEBHOOK_SECRET=",
  "EMAIL_FROM=",
  "# E2E_BASE_URL=",
  "# VERCEL_AUTOMATION_BYPASS_SECRET=",
].join("\n");

const PROXY_OK = `
export default async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === "/beheer" || pathname.startsWith("/beheer/")) return beheerProxy(request);
  return intlMiddleware(request);
}
export const config = {
  matcher: [
    "/((?!api|beheer|feeds|monitoring|_next|_vercel|149e9513-01fa-4fb0-aad4-566afd725d1b|.*\\\\..*).*)",
    "/beheer/:path*",
  ],
};
`;

describe("check-launch K5 en K6 (stubscripts)", () => {
  it("K5: een copyscript met exitcode 1 is een probleem", () => {
    const r = run({ "scripts/check-copy.mjs": "console.log('fout'); process.exit(1);" });
    assert.equal(rule(r, "K5").length, 1);
  });
  it("K6: check-claims --strict met exitcode 1 is een probleem", () => {
    const r = run({ "scripts/check-claims.mjs": "process.exit(process.argv.includes('--strict') ? 1 : 0);" });
    assert.equal(rule(r, "K6").length, 1);
  });
});

describe("check-launch K9 (omgevingsvariabelen)", () => {
  it("een vaste variabele die ontbreekt of alleen als commentaar staat, is een probleem", () => {
    const r = run({ ".env.example": ENV_OK.replace("CRON_SECRET=", "# CRON_SECRET=") });
    assert.equal(rule(r, "K9").length, 1);
    assert.match(rule(r, "K9")[0].text, /CRON_SECRET/);
  });
  it("de zes vaste plus optionele en shellvariabelen als commentaar geven geen probleem", () => {
    assert.equal(rule(run({ ".env.example": ENV_OK }), "K9").length, 0);
  });
  it("process.env zonder regel in .env.example is een probleem", () => {
    const r = run({ ".env.example": ENV_OK, "lib/x.ts": "export const a = process.env.ONBEKENDE_SLEUTEL;" });
    assert.equal(rule(r, "K9").length, 1);
  });
});

describe("check-launch K10 (geheimen)", () => {
  it("een gevolgd .env-bestand is een probleem", () => {
    const r = run({ ".env": "X=1", ".env.example": ENV_OK }, { git: true });
    assert.ok(rule(r, "K10").some((p) => p.text.includes(".env staat in git")));
  });
});

describe("check-launch K11 (proxy)", () => {
  it("een proxy volgens de regel geeft geen probleem", () => {
    assert.equal(rule(run({ "proxy.ts": PROXY_OK }), "K11").length, 0);
  });
  it("een eerste matcher zonder feeds is een probleem", () => {
    assert.ok(rule(run({ "proxy.ts": PROXY_OK.replace("|feeds", "") }), "K11").length > 0);
  });
  it("een eerste matcher zonder het BotID-voorvoegsel is een probleem", () => {
    assert.ok(rule(run({ "proxy.ts": PROXY_OK.replace("|149e9513-01fa-4fb0-aad4-566afd725d1b", "") }), "K11").length > 0);
  });
  it("een tweede matcher anders dan /beheer/:path* is een probleem", () => {
    assert.ok(rule(run({ "proxy.ts": PROXY_OK.replace('"/beheer/:path*"', '"/beheer/:path"') }), "K11").length > 0);
  });
  it("next-intl in de /beheer-tak is een probleem", () => {
    const fout = PROXY_OK.replace("return beheerProxy(request);", "return intlMiddleware(request);");
    assert.ok(rule(run({ "proxy.ts": fout }), "K11").length > 0);
  });
});

describe("check-launch K12 (paginametadata)", () => {
  it("een pagina zonder metadatahelper of met openGraph is een probleem", () => {
    const r = run({
      "app/[locale]/a/page.tsx": "export default function P() { return null; }",
      "app/[locale]/b/page.tsx": "export const metadata = pageMetadata({}); const x = { openGraph: {} };",
    });
    assert.equal(rule(r, "K12").length, 2);
  });
  it("het vangnet, de stijlgids en vacaturehelpers geven geen probleem", () => {
    const r = run({
      "app/[locale]/[...rest]/page.tsx": "export default function P() { return null; }",
      "app/[locale]/stijlgids/page.tsx": "export default function P() { return null; }",
      "app/[locale]/vacatures/page.tsx": "const m = vacancyListMetadata({});",
      "app/[locale]/vacatures/[slug]/page.tsx": "const m = vacancyMetadata({});",
    });
    assert.equal(rule(r, "K12").length, 0);
  });
});

describe("check-launch K4 en K14", () => {
  it("K4: example.com is een placeholder, behalve met een uitzondering", () => {
    const zonder = run({ "messages/en/forms.json": '{ "a": "Write it like name@example.com." }' });
    assert.ok(rule(zonder, "K4").length > 0);
    const met = run({
      "messages/en/forms.json": '{ "a": "Write it like name@example.com." }',
      "scripts/check-launch.uitzonderingen.json": JSON.stringify([
        { regel: "K4", bestand: "messages/en/forms.json", patroon: "name@example.com", reden: "voorbeeld", bevestigdDoor: "test", datum: "2026-10-02" },
      ]),
    });
    assert.equal(rule(met, "K4").length, 0);
  });
  it("K14: een hexkleur in een component is een probleem, een anker niet", () => {
    const r = run({
      "components/a.tsx": 'export const A = () => <div className="bg-[#ff0000]" />;',
      "components/b.tsx": 'export const B = () => <a href="#solliciteren">x</a>;',
    });
    assert.equal(rule(r, "K14").length, 1);
  });
});
