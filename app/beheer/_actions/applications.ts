"use server";

import { refresh } from "next/cache";
import type { Json } from "@/lib/database.types";
import { sendApplicationStatusEmail } from "@/lib/email/beheer";
import { createCvReadUrl } from "@/lib/supabase/cv-storage";
import { actionError, mapDbError, withAdmin } from "../_lib/action";
import type { ActionResult } from "../_lib/result";
import { APPLICATION_STATUS_MAIL } from "../_lib/status";
import { applicationStatusSchema, assignSchema, openCvSchema } from "../_lib/validation/application";
import { fieldErrorsOf } from "../_lib/validation/common";
import { S, fill } from "../_strings";
import type { ApplicationStatus } from "@/lib/data/options";

/** Acties op sollicitaties (spec 08 §5.3 tabel 3). */

export async function setApplicationStatus(input: {
  id: string;
  status: ApplicationStatus;
  /** true: stuur de kandidaat de e-mail die bij de status hoort (uitnodiging, afwijzing of welkom). */
  notify?: boolean;
  meetingDate?: string;
  meetingTime?: string;
}): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = applicationStatusSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    const { id, status, notify, meetingDate, meetingTime } = parsed.data;
    const { data: before, error: readError } = await ctx.supabase
      .from("applications")
      .select("status")
      .eq("id", id)
      .is("anonymized_at", null)
      .maybeSingle();
    if (readError) return mapDbError(readError);
    if (!before) return actionError("niet_gevonden");
    // De triggers van spec 10 schrijven status_change en het logboek.
    const { data, error } = await ctx.supabase
      .from("applications")
      .update({ status })
      .eq("id", id)
      .is("anonymized_at", null)
      .select("id");
    if (error) return mapDbError(error);
    if (!data?.length) return actionError("niet_gevonden");

    const label = { status: S.status.application[status] };
    let toast = fill(S.toasts.statusChanged, label);
    // Alleen na een echte wijziging en een expliciete keuze in de dialoog gaat er een mail uit.
    const mailKind = notify && before.status !== status ? APPLICATION_STATUS_MAIL[status] : undefined;
    if (mailKind) {
      const mail = await sendApplicationStatusEmail({
        applicationId: id,
        kind: mailKind,
        meeting: meetingDate && meetingTime ? { date: meetingDate, time: meetingTime } : undefined,
      });
      if (mail === "sent") {
        const { error: activityError } = await ctx.supabase.from("activities").insert({
          entity_type: "application",
          entity_id: id,
          kind: "email_sent",
          actor_id: ctx.userId,
          payload: { mail: mailKind } as Json,
        });
        if (activityError) console.error(`[beheer] statusmail niet in de tijdlijn: ${activityError.code ?? ""}`);
        toast = fill(S.toasts.statusChangedMailSent, label);
      } else if (mail === "failed") {
        toast = fill(S.toasts.statusChangedMailFailed, label);
      }
    }
    refresh();
    return { ok: true, toast };
  });
}

export async function assignApplication(input: { id: string; adminId: string | null }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = assignSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    const { data, error } = await ctx.supabase
      .from("applications")
      .update({ assigned_to: parsed.data.adminId })
      .eq("id", parsed.data.id)
      .select("id, assigned:admin_profiles!assigned_to(display_name)")
      .maybeSingle();
    if (error) return mapDbError(error);
    if (!data) return actionError("niet_gevonden");
    await ctx.supabase.from("activities").insert({
      entity_type: "application",
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

/** Signed URL van 60 seconden; createCvReadUrl schrijft zelf cv_viewed in tijdlijn en logboek. */
export async function openCv(input: { applicationId: string; download: boolean }): Promise<ActionResult<{ url: string }>> {
  return withAdmin<{ url: string }>(async (ctx) => {
    const parsed = openCvSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    try {
      const url = await createCvReadUrl({
        supabase: ctx.supabase,
        applicationId: parsed.data.applicationId,
        download: parsed.data.download,
      });
      return { ok: true, toast: S.applications.cv.opening, data: { url } };
    } catch (error) {
      console.error("[beheer] cv openen mislukt", error instanceof Error ? error.message : "");
      return { ok: false, code: "onbekend", message: S.errors.cvFailed };
    }
  });
}
