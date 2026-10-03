import type { NextRequest } from "next/server";
import { z } from "zod";
import { verifyCronRequest } from "@/lib/cron/auth";
import { revalidateVacancies } from "@/lib/data/revalidate";

// Ververst de vacaturecache na een wijziging met SQL (seed, seed-reset, een
// AC-test of execute_sql), buiten productie (spec 10 §4.4, B-46). Dezelfde
// Bearer-controle als de cron-routes; op productie onvindbaar.
export const dynamic = "force-dynamic";

const Body = z.object({ numbers: z.array(z.number().int()), kind: z.enum(["content", "visibility"]) });

export async function POST(request: NextRequest) {
  if (process.env.VERCEL_ENV === "production") return new Response(null, { status: 404 });
  const denied = verifyCronRequest(request); // Bearer-controle met CRON_SECRET; 401 zonder
  if (denied) return denied;
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  revalidateVacancies(parsed.data.numbers, parsed.data.kind);
  return Response.json({ ok: true });
}
