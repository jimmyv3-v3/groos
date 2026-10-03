import { describe, expect, it } from "vitest";
import { databaseHeeftTabellen } from "../../scripts/lib/testomgeving.mjs";

// RLS via de publishable key (AC-10-04 tot en met AC-10-07). Zonder tabellen
// (migraties niet toegepast) slaat deze suite zich over.
const tabellen = await databaseHeeftTabellen();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

async function rest(pad: string, init: RequestInit = {}) {
  return fetch(`${url}/rest/v1/${pad}`, {
    ...init,
    headers: { apikey: key, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
}

describe.skipIf(!tabellen)("RLS voor anoniem (AC-10-04 tot en met AC-10-07)", () => {
  it("public_vacancies geeft alleen open en recent gesloten vacatures", async () => {
    const res = await rest("public_vacancies?select=number,state");
    expect(res.ok).toBe(true);
    const rows = (await res.json()) as { number: number; state: string }[];
    for (const row of rows) expect(["open", "closed"]).toContain(row.state);
  });

  it("applications en audit_log zijn afgeschermd", async () => {
    for (const tabel of ["applications", "audit_log"]) {
      const res = await rest(`${tabel}?select=id&limit=1`);
      const body = (await res.json()) as { code?: string } | unknown[];
      expect(Array.isArray(body) ? body.length : (body as { code?: string }).code).toSatisfy(
        (v: unknown) => v === 0 || v === "42501",
      );
    }
  });

  it("anoniem kan geen contactbericht invoegen", async () => {
    const res = await rest("contact_messages", {
      method: "POST",
      body: JSON.stringify({ name: "RLS", email: "rls@example.com", topic: "other", message: "test" }),
    });
    expect(res.ok).toBe(false);
  });
});
