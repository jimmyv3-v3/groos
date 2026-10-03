"use server";

import { refresh } from "next/cache";
import type { Json } from "@/lib/database.types";
import type { MessageStatus } from "@/lib/data/options";
import { actionError, mapDbError, withAdmin } from "../_lib/action";
import type { ActionResult } from "../_lib/result";
import { messageStatusSchema } from "../_lib/validation/application";
import { fieldErrorsOf } from "../_lib/validation/common";
import { S, fill } from "../_strings";

/** Status van een bericht (spec 08 §5.3 tabel 3). De trigger zet handled_at en handled_by. */
export async function setMessageStatus(input: { id: string; status: MessageStatus }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = messageStatusSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    const { data: current, error: readError } = await ctx.supabase
      .from("contact_messages")
      .select("status")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (readError) return mapDbError(readError);
    if (!current) return actionError("niet_gevonden");
    const { error } = await ctx.supabase
      .from("contact_messages")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.id);
    if (error) return mapDbError(error);
    await ctx.supabase.from("activities").insert({
      entity_type: "contact_message",
      entity_id: parsed.data.id,
      kind: "status_change",
      actor_id: ctx.userId,
      payload: { from: current.status, to: parsed.data.status } as Json,
    });
    refresh();
    return { ok: true, toast: fill(S.toasts.statusChanged, { status: S.status.message[parsed.data.status] }) };
  });
}
