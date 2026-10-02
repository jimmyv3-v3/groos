import "server-only";
import type { AdminContext } from "../_lib/auth";
import type { NavCounts } from "../_lib/types";

/** Drie head-queries voor de tellers in de navigatie (spec 08 §5.2). Fout: nullen, de shell blijft staan. */
export async function getNavCounts(ctx: AdminContext): Promise<NavCounts> {
  const [apps, reqs, msgs] = await Promise.all([
    ctx.supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "new")
      .is("anonymized_at", null),
    ctx.supabase.from("staff_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    ctx.supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  return {
    applicationsNew: apps.count ?? 0,
    requestsNew: reqs.count ?? 0,
    messagesNew: msgs.count ?? 0,
  };
}
