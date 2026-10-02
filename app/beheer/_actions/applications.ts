"use server";

import { refresh } from "next/cache";
import type { Json } from "@/lib/database.types";
import { createCvReadUrl } from "@/lib/supabase/cv-storage";
import { actionError, mapDbError, withAdmin } from "../_lib/action";
import type { ActionResult } from "../_lib/result";
import { applicationStatusSchema, assignSchema, openCvSchema } from "../_lib/validation/application";
import { fieldErrorsOf } from "../_lib/validation/common";
import { S, fill } from "../_strings";
import type { ApplicationStatus } from "@/lib/data/options";

/** Acties op sollicitaties (spec 08 §5.3 tabel 3). */

export async function setApplicationStatus(input: { id: string; status: ApplicationStatus }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = applicationStatusSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    // De triggers van spec 10 schrijven status_change en het logboek.
    const { data, error } = await ctx.supabase
      .from("applications")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.id)
      .is("anonymized_at", null)
      .select("id");
    if (error) return mapDbError(error);
    if (!data?.length) return actionError("niet_gevonden");
    refresh();
    return { ok: true, toast: fill(S.toasts.statusChanged, { status: S.status.application[parsed.data.status] }) };
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
