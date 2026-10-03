import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { weigerReden } from "../../../scripts/supabase/seed-reset.mjs";

// AC-10-32 (B-46): de seed-reset raakt alleen groos-dev.
describe("scripts/supabase/seed-reset.mjs (AC-10-32)", () => {
  it("weigert een database-URL zonder de ref van groos-dev", () => {
    expect(weigerReden(undefined)).toMatch(/Seed-reset gestopt: SUPABASE_DB_URL wijst niet naar groos-dev/);
    expect(weigerReden("postgresql://postgres.abcdefprod:pw@aws-0-eu-central-1.pooler.supabase.com:5432/postgres")).not.toBeNull();
    expect(
      weigerReden("postgresql://postgres.smcskfrkjgniinbhqnln:pw@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"),
    ).toBeNull();
  });

  it("stopt met exitcode 1 zonder databaseverbinding als de ref ontbreekt", () => {
    const result = spawnSync(process.execPath, ["scripts/supabase/seed-reset.mjs"], {
      env: { ...process.env, SUPABASE_DB_URL: "postgresql://postgres:pw@productie.example:5432/postgres" },
      encoding: "utf8",
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Dit script draait alleen op het ontwikkelproject.");
  });
});
