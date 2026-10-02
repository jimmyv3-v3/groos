"use server";

import { refresh } from "next/cache";
import type { Json } from "@/lib/database.types";
import type { StaffRequestStatus } from "@/lib/data/options";
import { actionError, mapDbError, withAdmin } from "../_lib/action";
import type { ActionResult } from "../_lib/result";
import { assignSchema, staffRequestStatusSchema } from "../_lib/validation/application";
import { fieldErrorsOf } from "../_lib/validation/common";
import { S, fill } from "../_strings";

/** Acties op personeelsaanvragen (spec 08 §5.3 tabel 3). Geen trigger voor de tijdlijn: de actie schrijft zelf. */

export async function setStaffRequestStatus(input: { id: string; status: StaffRequestStatus }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = staffRequestStatusSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    const { data: current, error: readError } = await ctx.supabase
      .from("staff_requests")
      .select("status")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (readError) return mapDbError(readError);
    if (!current) return actionError("niet_gevonden");
    const { error } = await ctx.supabase
      .from("staff_requests")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.id);
    if (error) return mapDbError(error);
    await ctx.supabase.from("activities").insert({
      entity_type: "staff_request",
      entity_id: parsed.data.id,
      kind: "status_change",
      actor_id: ctx.userId,
      payload: { from: current.status, to: parsed.data.status } as Json,
    });
    refresh();
    return { ok: true, toast: fill(S.toasts.statusChanged, { status: S.status.staffRequest[parsed.data.status] }) };
  });
}

export async function assignStaffRequest(input: { id: string; adminId: string | null }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = assignSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    const { data, error } = await ctx.supabase
      .from("staff_requests")
      .update({ assigned_to: parsed.data.adminId })
      .eq("id", parsed.data.id)
      .select("id, assigned:admin_profiles!assigned_to(display_name)")
      .maybeSingle();
    if (error) return mapDbError(error);
    if (!data) return actionError("niet_gevonden");
    await ctx.supabase.from("activities").insert({
      entity_type: "staff_request",
      entity_id: parsed.data.id,
      kind: "assigned",
      actor_id: ctx.userId,
      payload: { to: parsed.data.adminId } as Json,
    });
    refresh();
    const name = data.assigned?.display_name;
    return { ok: true, toast: name ? fill(S.toasts.assigned, { naam: name }) : S.toasts.unassigned };
  });
}
