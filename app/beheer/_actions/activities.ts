"use server";

import { refresh } from "next/cache";
import { actionError, mapDbError, withAdmin } from "../_lib/action";
import type { ActionResult } from "../_lib/result";
import { contactAttemptSchema, fieldErrorsOf, noteSchema } from "../_lib/validation/common";
import { S } from "../_strings";

/** Notities en contactpogingen (spec 08 §5.3 tabel 3). */

export async function addNote(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = noteSchema.safeParse({
      entityType: formData.get("entityType"),
      entityId: formData.get("entityId"),
      body: formData.get("body") ?? "",
    });
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    // Bij een sollicitatie zet de trigger last_contact_at en zo nodig in_progress.
    const { error } = await ctx.supabase.from("activities").insert({
      entity_type: parsed.data.entityType,
      entity_id: parsed.data.entityId,
      kind: "note",
      body: parsed.data.body,
      actor_id: ctx.userId,
    });
    if (error) return mapDbError(error);
    refresh();
    return { ok: true, toast: S.toasts.noteAdded };
  });
}

/** Geen toast; fouten worden alleen gelogd, de link opent altijd. */
export async function logContactAttempt(input: {
  entityType: "application" | "staff_request" | "contact_message";
  entityId: string;
  channel: "call" | "whatsapp" | "email";
}): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = contactAttemptSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    const kind = parsed.data.channel === "email" ? "email_sent" : parsed.data.channel;
    const { error } = await ctx.supabase.from("activities").insert({
      entity_type: parsed.data.entityType,
      entity_id: parsed.data.entityId,
      kind,
      actor_id: ctx.userId,
    });
    if (error) {
      console.error(`[beheer] contactpoging niet opgeslagen: ${error.code ?? ""}`);
      return { ok: true, toast: "" };
    }
    refresh();
    return { ok: true, toast: "" };
  });
}
