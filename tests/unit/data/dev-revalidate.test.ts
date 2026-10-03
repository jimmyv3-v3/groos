import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// AC-10-31 (B-46): POST /api/dev/revalidate met Bearer CRON_SECRET, 404 op productie.

const calls = vi.hoisted(() => [] as unknown[][]);
vi.mock("@/lib/data/revalidate", () => ({
  revalidateVacancies: (...args: unknown[]) => calls.push(args),
}));

const SECRET = "a".repeat(64);

function verzoek(body: unknown, auth?: string) {
  return new NextRequest("http://localhost:3000/api/dev/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json", ...(auth ? { authorization: auth } : {}) },
    body: JSON.stringify(body),
  });
}

describe("POST /api/dev/revalidate (AC-10-31)", () => {
  beforeEach(() => {
    calls.length = 0;
    vi.stubEnv("CRON_SECRET", SECRET);
    vi.stubEnv("VERCEL_ENV", "");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("geeft 401 zonder Bearer", async () => {
    const { POST } = await import("@/app/api/dev/revalidate/route");
    const res = await POST(verzoek({ numbers: [1002], kind: "visibility" }));
    expect(res.status).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it("geeft 200 met Bearer en ververst de vacatures", async () => {
    const { POST } = await import("@/app/api/dev/revalidate/route");
    const res = await POST(verzoek({ numbers: [1002], kind: "visibility" }, `Bearer ${SECRET}`));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls).toEqual([[[1002], "visibility"]]);
  });

  it("geeft 400 bij een ongeldige body", async () => {
    const { POST } = await import("@/app/api/dev/revalidate/route");
    const res = await POST(verzoek({ numbers: ["x"], kind: "alles" }, `Bearer ${SECRET}`));
    expect(res.status).toBe(400);
  });

  it("geeft 404 op productie, ook met Bearer", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const { POST } = await import("@/app/api/dev/revalidate/route");
    const res = await POST(verzoek({ numbers: [1002], kind: "visibility" }, `Bearer ${SECRET}`));
    expect(res.status).toBe(404);
    expect(calls).toHaveLength(0);
  });
});
