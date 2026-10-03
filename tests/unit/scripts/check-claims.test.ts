import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "vitest";

// Claimcontrole van spec 09 §10 blok A stap 10 en 11 (AC-09-16, AC-09-23).
type Rules = {
  scan: string[];
  ignore: string[];
  rules: { id: string; level: "review" | "block"; pattern: string; flags?: string; note: string }[];
  allow: { rule: string; files: string[] }[];
};
const config = JSON.parse(readFileSync("lib/compliance/copy-rules.json", "utf8")) as Rules;
const rule = (id: string) => {
  const r = config.rules.find((x) => x.id === id);
  assert.ok(r, `regel ${id} ontbreekt`);
  return new RegExp(r.pattern, r.flags);
};

function run(...args: string[]) {
  return spawnSync(process.execPath, ["scripts/check-claims.mjs", ...args], { encoding: "utf8" });
}

describe("check-claims (spec 09 §6.9)", () => {
  it("draait, groepeert per CL- of VR-id met bestand en regelnummer en eindigt met 0", () => {
    const res = run();
    assert.equal(res.status, 0, res.stderr);
    assert.match(res.stdout, /Claimcontrole: \d+ treffer\(s\)/);
    for (const block of res.stdout.split("\n\n").filter((b) => b.startsWith("["))) {
      assert.match(block, /^\[(CL|VR)-\d{2}[ab]?\] /);
      for (const line of block.split("\n").slice(1)) assert.match(line, /^ {2}\S+:\d+ {2}/);
    }
  });

  it("vindt met --strict geen blokkerende treffer", () => {
    const res = run("--strict");
    assert.equal(res.status, 0, res.stdout);
  });

  it("kent elke regel uit de checklist met het juiste niveau", () => {
    const ids = config.rules.map((r) => r.id);
    for (const id of ["CL-01", "CL-02", "CL-03", "CL-04", "CL-05", "CL-06", "CL-07", "CL-09", "CL-10", "CL-11", "CL-14", "CL-15", "CL-16", "CL-18", "CL-19", "CL-22", "VR-01", "VR-02", "VR-03", "VR-07", "VR-08", "VR-10", "VR-11a", "VR-11b", "VR-13"]) {
      assert.ok(ids.includes(id), `regel ${id} ontbreekt`);
    }
    const blocking = config.rules.filter((r) => r.level === "block").map((r) => r.id).sort();
    assert.deepEqual(blocking, ["CL-15", "VR-11a"]);
  });

  it("verwijst in allow alleen naar bestaande bestanden", () => {
    for (const { rule: id, files } of config.allow) {
      for (const file of files) assert.ok(existsSync(file), `${id}: ${file} bestaat niet`);
    }
  });

  it("vangt de verboden voorbeelden en laat de toegestane vorm staan", () => {
    assert.match("Stuur een kopie van je paspoort mee.", rule("VR-11a"));
    assert.doesNotMatch("Bij het kennismakingsgesprek nemen wij je identiteitsbewijs door.", rule("VR-11a"));
    assert.match("Wij zoeken een native speaker.", rule("VR-03"));
    assert.match("moedertaal Nederlands", rule("VR-03"));
    assert.doesNotMatch("Other ways to get in touch: alternatives", rule("VR-03"));
    assert.match("Wij doen ook payrolling.", rule("CL-18"));
    assert.doesNotMatch("payroll taxes and VAT", rule("CL-18"));
    assert.match("starters gezocht", rule("VR-02"));
    assert.doesNotMatch("  starter: { min: 14 },", rule("VR-02"));
  });
});
