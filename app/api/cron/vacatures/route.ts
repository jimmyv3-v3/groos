import type { NextRequest } from "next/server";
import { cronErrorResponse, verifyCronRequest } from "@/lib/cron/auth";
import { revalidateVacancies } from "@/lib/data/revalidate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Vercel Cron, elk kwartier (spec 10 §4.6): gepland naar online, verlopen naar
// gesloten, langer dan 30 dagen gesloten naar gearchiveerd. Idempotent.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;

  try {
    const { data, error } = await createSupabaseAdminClient().rpc("run_vacancy_lifecycle");
    if (error) throw new Error(`run_vacancy_lifecycle: ${error.message}`);

    const rows = data ?? [];
    const byEvent = (event: string) => rows.filter((r) => r.event === event).map((r) => r.vacancy_number);
    const published = byEvent("published");
    const closed = byEvent("closed");
    const archived = byEvent("archived");

    const changed = [...published, ...closed, ...archived];
    if (changed.length > 0) revalidateVacancies(changed, "visibility");

    return Response.json({ ok: true, published, closed, archived, ranAt: new Date().toISOString() });
  } catch (error) {
    return cronErrorResponse("vacatures", error);
  }
}
