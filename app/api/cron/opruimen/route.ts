import type { NextRequest } from "next/server";
import { cronErrorResponse, verifyCronRequest } from "@/lib/cron/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { removeStalePendingUploads } from "@/lib/supabase/cv-storage";

// Vercel Cron, elke nacht (spec 10 §4.6): losse uploads ouder dan 24 uur weg,
// e-maillog ouder dan 90 dagen en auditlog ouder dan 2 jaar weg. Idempotent.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;

  try {
    const { removed } = await removeStalePendingUploads(24);

    const { data, error } = await createSupabaseAdminClient().rpc("purge_logs");
    if (error) throw new Error(`purge_logs: ${error.message}`);
    const counts = (data ?? {}) as { email_log?: number; audit_log?: number };

    return Response.json({
      ok: true,
      pendingRemoved: removed,
      emailLogDeleted: counts.email_log ?? 0,
      auditLogDeleted: counts.audit_log ?? 0,
      ranAt: new Date().toISOString(),
    });
  } catch (error) {
    return cronErrorResponse("opruimen", error);
  }
}
