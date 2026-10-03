import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "vitest";

// Fixtures van spec 03 §6.19: fout.json meldt elke regel precies één keer, goed.json niets.
type Finding = { rule: string; fixtureRule: string | null };

function fixture(name: string): { errors: Finding[]; warnings: Finding[] } {
  const res = spawnSync(process.execPath, ["scripts/check-copy.mjs", "--fixture", name, "--json"], { encoding: "utf8" });
  return JSON.parse(res.stdout) as { errors: Finding[]; warnings: Finding[] };
}

describe("check-copy (spec 03 §6.19)", () => {
  it("fout.json meldt C-01 tot en met C-20, C-22 en C-23 elk precies één keer", () => {
    const { errors, warnings } = fixture("fout.json");
    const rules = [...errors, ...warnings].map((f) => f.rule).sort();
    const expected = [...Array.from({ length: 20 }, (_, i) => `C-${String(i + 1).padStart(2, "0")}`), "C-22", "C-23"];
    assert.deepEqual(rules, expected);
  });

  it("goed.json meldt niets", () => {
    const { errors, warnings } = fixture("goed.json");
    assert.deepEqual([...errors, ...warnings], []);
  });
});
