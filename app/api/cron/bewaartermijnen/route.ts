import type { NextRequest } from "next/server";
import { cronErrorResponse, verifyCronRequest } from "@/lib/cron/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { removeApplicationFiles } from "@/lib/supabase/cv-storage";

// Vercel Cron, elke nacht (spec 10 §4.6, B-07): sollicitaties zonder contact
// afsluiten, verlopen sollicitaties anonimiseren (eerst de cv's uit Storage) en
// verlopen aanvragen en berichten verwijderen. Idempotent.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH_SIZE = 200;

export async function GET(request: NextRequest) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;

  try {
    const supabase = createSupabaseAdminClient();

    const { data: autoClosed, error: closeError } = await supabase.rpc("auto_close_stale_applications");
    if (closeError) throw new Error(`auto_close_stale_applications: ${closeError.message}`);

    let anonymized = 0;
    const failed = new Set<string>();
    for (;;) {
      const { data: due, error: dueError } = await supabase
        .from("applications")
        .select("id")
        .is("anonymized_at", null)
        .lte("retain_until", new Date().toISOString())
        .order("retain_until", { ascending: true })
        .limit(BATCH_SIZE + failed.size);
      if (dueError) throw new Error(`applications: ${dueError.message}`);

      const ids = (due ?? []).map((r) => r.id).filter((id) => !failed.has(id)).slice(0, BATCH_SIZE);
      if (ids.length === 0) break;

      const { removedIds } = await removeApplicationFiles(ids);
      for (const id of ids) if (!removedIds.includes(id)) failed.add(id);
      if (removedIds.length === 0) break;

      const { data: count, error: anonError } = await supabase.rpc("anonymize_applications", { p_ids: removedIds });
      if (anonError) throw new Error(`anonymize_applications: ${anonError.message}`);
      anonymized += count ?? 0;
      if (ids.length < BATCH_SIZE) break;
    }

    const { data: purged, error: purgeError } = await supabase.rpc("purge_expired_records");
    if (purgeError) throw new Error(`purge_expired_records: ${purgeError.message}`);
    const counts = (purged ?? {}) as { staff_requests?: number; contact_messages?: number };

    return Response.json({
      ok: true,
      autoClosed: autoClosed ?? 0,
      anonymized,
      staffRequestsDeleted: counts.staff_requests ?? 0,
      contactMessagesDeleted: counts.contact_messages ?? 0,
      ranAt: new Date().toISOString(),
    });
  } catch (error) {
    return cronErrorResponse("bewaartermijnen", error);
  }
}
