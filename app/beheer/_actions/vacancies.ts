"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Json } from "@/lib/database.types";
import { isClaimConfirmed } from "@/lib/claims";
import {
  VACANCY_DEFAULT_CLOSE_DAYS,
  VACANCY_EXTEND_DAYS,
  type CloseReason,
  type VacancyStatus,
} from "@/lib/data/options";
import { revalidateVacancies } from "@/lib/data/revalidate";
import { publicStateOf } from "../_data/vacancies";
import { actionError, mapDbError, publishFieldErrors, withAdmin } from "../_lib/action";
import type { AdminContext } from "../_lib/auth";
import {
  amsterdamDateEndToIso,
  amsterdamDateKey,
  amsterdamLocalToIso,
  formatDateNl,
  formatTimeNl,
  isoToAmsterdamLocal,
} from "../_lib/format";
import { beheerPaths } from "../_lib/paths";
import type { ActionResult } from "../_lib/result";
import {
  extendRevalidationKind,
  saveRevalidationKind,
  scheduleRevalidationKind,
  unscheduleRevalidationKind,
} from "../_lib/revalidation";
import { isPublishErrorCode, type PublishErrorCode } from "../_lib/types";
import { fieldErrorsOf, uuid } from "../_lib/validation/common";
import { vacancyDraftSchema, vacancyValuesFromFormData } from "../_lib/validation/vacancy";
import { S, fill } from "../_strings";

/** Vacature-acties (spec 08 §5.3 tabel 2). Elke export begint met withAdmin. */

const idSchema = z.object({ id: uuid });
const DAY = 24 * 60 * 60 * 1000;

type Current = {
  id: string;
  number: number;
  status: VacancyStatus;
  updated_at: string;
  publish_at: string | null;
  closes_at: string | null;
  closed_at: string | null;
  image_path: string | null;
  training_offered: string[];
  /** Slug van de nl-vertaling vóór de actie. */
  slug: string | null;
  /** Publieke staat vóór de actie, zoals getVacancyForEdit die berekent (§5.3). */
  publicState: "open" | "closed" | null;
};

async function loadCurrent(ctx: AdminContext, id: string): Promise<Current | null> {
  const { data, error } = await ctx.supabase
    .from("vacancies")
    .select(
      "id, number, status, updated_at, publish_at, closes_at, closed_at, image_path, training_offered, nl:vacancy_translations(slug)",
    )
    .eq("id", id)
    .eq("vacancy_translations.locale", "nl")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { nl, ...row } = data;
  return { ...row, slug: nl[0]?.slug ?? null, publicState: publicStateOf(row) };
}


async function publishErrors(ctx: AdminContext, id: string): Promise<PublishErrorCode[]> {
  const { data, error } = await ctx.supabase.rpc("vacancy_publish_errors", { p_vacancy_id: id });
  if (error) throw error;
  return (data ?? []).filter(isPublishErrorCode);
}

async function logStatusChange(
  ctx: AdminContext,
  id: string,
  from: VacancyStatus,
  to: VacancyStatus,
  reason?: CloseReason,
): Promise<void> {
  const { error } = await ctx.supabase.from("activities").insert({
    entity_type: "vacancy",
    entity_id: id,
    kind: "status_change",
    actor_id: ctx.userId,
    payload: { from, to, ...(reason ? { reason } : {}) } as Json,
  });
  if (error) console.error(`[beheer] activiteit status_change niet opgeslagen: ${error.code ?? ""}`);
}

/**
 * Statuswissel met tijdlijn. Bij een ongeldige overgang (twee beheerders
 * tegelijk) ververst de pagina en volgt ongeldige_overgang.
 */
async function transition(
  ctx: AdminContext,
  id: string,
  allowedFrom: readonly VacancyStatus[],
  to: VacancyStatus,
  extra: Partial<{ close_reason: CloseReason; closes_at: string | null; publish_at: string | null }> = {},
): Promise<ActionResult<{ current: Current }>> {
  const current = await loadCurrent(ctx, id);
  if (!current) return actionError("niet_gevonden");
  if (!allowedFrom.includes(current.status)) {
    refresh();
    return actionError("ongeldige_overgang");
  }
  const { error } = await ctx.supabase
    .from("vacancies")
    .update({ status: to, ...extra })
    .eq("id", id)
    .eq("status", current.status);
  if (error) {
    const mapped = mapDbError(error);
    if (!mapped.ok && mapped.code === "ongeldige_overgang") refresh();
    return mapped;
  }
  await logStatusChange(ctx, id, current.status, to, extra.close_reason);
  return { ok: true, toast: "", data: { current } };
}

export async function saveVacancy(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const id = String(formData.get("id") ?? "") || null;
    const sentUpdatedAt = String(formData.get("updated_at") ?? "");
    const intent = formData.get("intent") === "publish" ? "publish" : "save";

    const [current, contacts] = await Promise.all([
      id ? loadCurrent(ctx, id) : Promise.resolve(null),
      // Contactpersoon: alleen actieve beheerders met een telefoonnummer (B-48).
      ctx.supabase.from("admin_profiles").select("id").eq("is_active", true).not("phone_e164", "is", null),
    ]);
    if (contacts.error) throw contacts.error;
    if (id && !current) return actionError("niet_gevonden");
    if (current && sentUpdatedAt && Date.parse(current.updated_at) > Date.parse(sentUpdatedAt)) {
      return actionError("conflict");
    }

    const storedClosesOn = current?.closes_at ? isoToAmsterdamLocal(current.closes_at).slice(0, 10) : null;
    const values = vacancyValuesFromFormData(formData);
    const parsed = vacancyDraftSchema({
      status: current?.status ?? null,
      contactIds: (contacts.data ?? []).map((a) => a.id),
      storedClosesOn,
    }).safeParse(values);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));

    // Ongewijzigde sluitdatum houdt het opgeslagen tijdstip; bij closed is hij
    // alleen-lezen (heropenen gaat via reopenVacancy). Zonder claim
    // certificateSupport negeert de actie training_offered uit het formulier (§4.7).
    const keepClosesAt = current && (current.status === "closed" || values.closes_at.trim() === storedClosesOn);
    const closesAt = current && keepClosesAt ? current.closes_at : parsed.data.vacancy.closes_at;
    const trainingOffered = isClaimConfirmed("certificateSupport")
      ? parsed.data.vacancy.training_offered
      : (current?.training_offered ?? []);

    const { data: saved, error } = await ctx.supabase.rpc("save_vacancy", {
      // Nieuwe vacature: p_id is null (de gegenereerde typen kennen geen null voor uuid-argumenten).
      p_id: (current?.id ?? null) as unknown as string,
      p_vacancy: {
        ...parsed.data.vacancy,
        closes_at: closesAt,
        training_offered: trainingOffered,
        publish_at: current?.publish_at ?? null,
        image_path: current?.image_path ?? null,
      } as Json,
      p_nl: parsed.data.nl as Json,
    });
    if (error) return mapDbError(error);
    const row = saved?.[0];
    if (!row) return actionError("onbekend");

    const status: VacancyStatus = current?.status ?? "draft";
    let toast: string = status === "published" || status === "closed" ? S.toasts.changesPublished : S.toasts.saved;
    let melding = "opgeslagen";
    let publishedFromDraft = false;

    // Alleen vanuit een concept (of een nieuwe vacature) is intent publish een publicatie; anders opslaan.
    if (intent === "publish" && status === "draft") {
      const errors = await publishErrors(ctx, row.vacancy_id);
      if (errors.length > 0) {
        if (!current) redirect(`${beheerPaths.vacancy(row.vacancy_number)}?melding=savedNotPublished`);
        refresh();
        return actionError("niet_publiceerbaar", publishFieldErrors(errors));
      }
      const { error: pubError } = await ctx.supabase
        .from("vacancies")
        .update({ status: "published" })
        .eq("id", row.vacancy_id)
        .eq("status", "draft");
      if (pubError) return mapDbError(pubError);
      await logStatusChange(ctx, row.vacancy_id, status, "published");
      publishedFromDraft = true;
      toast = S.toasts.published;
      melding = "published";
    }

    const kind = saveRevalidationKind({
      publishedFromDraft,
      publicStateBefore: current?.publicState ?? null,
      slugBefore: current?.slug ?? null,
      slugAfter: row.vacancy_slug,
      closesAtBefore: current?.closes_at ?? null,
      closesAtAfter: closesAt,
    });
    if (kind) revalidateVacancies([row.vacancy_number], kind);

    if (!current) redirect(`${beheerPaths.vacancy(row.vacancy_number)}?melding=${melding}`);
    refresh();
    return { ok: true, toast };
  });
}

export async function publishVacancy(input: { id: string }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const { id } = idSchema.parse(input);
    const errors = await publishErrors(ctx, id);
    if (errors.length > 0) return actionError("niet_publiceerbaar", publishFieldErrors(errors));
    const result = await transition(ctx, id, ["draft", "scheduled"], "published");
    if (!result.ok) return result;
    revalidateVacancies([result.data!.current.number], "visibility");
    refresh();
    return { ok: true, toast: S.toasts.published };
  });
}

const scheduleSchema = z.object({
  id: uuid,
  publishAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, S.validation.publishInPast),
  closesOn: z.string().optional(),
});

export async function scheduleVacancy(input: { id: string; publishAt: string; closesOn?: string }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = scheduleSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    const publishIso = amsterdamLocalToIso(parsed.data.publishAt);
    if (Date.parse(publishIso) < Date.now() + 5 * 60 * 1000) {
      return actionError("ongeldig", { publishAt: [S.validation.publishInPast] });
    }
    // Zonder sluitdatum: publishAt plus VACANCY_DEFAULT_CLOSE_DAYS, vanuit draft en vanuit scheduled.
    let closesIso = new Date(Date.parse(publishIso) + VACANCY_DEFAULT_CLOSE_DAYS * DAY).toISOString();
    if (parsed.data.closesOn) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed.data.closesOn)) {
        return actionError("ongeldig", { closesOn: [S.validation.closesInPast] });
      }
      closesIso = amsterdamDateEndToIso(parsed.data.closesOn);
      if (Date.parse(closesIso) <= Date.parse(publishIso)) {
        return actionError("ongeldig", { closesOn: [S.validation.closesBeforePublish] });
      }
    }
    const errors = (await publishErrors(ctx, parsed.data.id)).filter((c) => c !== "publish_at");
    if (errors.length > 0) return actionError("niet_publiceerbaar", publishFieldErrors(errors));

    const current = await loadCurrent(ctx, parsed.data.id);
    if (!current) return actionError("niet_gevonden");
    if (current.status === "scheduled") {
      const { error } = await ctx.supabase
        .from("vacancies")
        .update({ publish_at: publishIso, closes_at: closesIso })
        .eq("id", current.id);
      if (error) return mapDbError(error);
    } else {
      const result = await transition(ctx, current.id, ["draft"], "scheduled", {
        publish_at: publishIso,
        closes_at: closesIso,
      });
      if (!result.ok) return result;
    }
    const kind = scheduleRevalidationKind(current.status, current.publicState);
    if (kind) revalidateVacancies([current.number], kind);
    refresh();
    return {
      ok: true,
      toast: fill(S.toasts.scheduled, { datum: formatDateNl(publishIso), tijd: formatTimeNl(publishIso) }),
    };
  });
}

export async function unscheduleVacancy(input: { id: string }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const { id } = idSchema.parse(input);
    const result = await transition(ctx, id, ["scheduled"], "draft");
    if (!result.ok) return result;
    const { current } = result.data!;
    const kind = unscheduleRevalidationKind(current.publicState);
    if (kind) revalidateVacancies([current.number], kind);
    refresh();
    return { ok: true, toast: S.toasts.unscheduled };
  });
}

export async function takeOfflineVacancy(input: { id: string }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const { id } = idSchema.parse(input);
    const result = await transition(ctx, id, ["published"], "draft");
    if (!result.ok) return result;
    revalidateVacancies([result.data!.current.number], "visibility");
    refresh();
    return { ok: true, toast: S.toasts.offline };
  });
}

const closeSchema = z.object({ id: uuid, reason: z.enum(["filled", "withdrawn", "other"]) });

export async function closeVacancy(input: { id: string; reason: "filled" | "withdrawn" | "other" }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = closeSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    const result = await transition(ctx, parsed.data.id, ["published"], "closed", { close_reason: parsed.data.reason });
    if (!result.ok) return result;
    revalidateVacancies([result.data!.current.number], "visibility");
    refresh();
    return { ok: true, toast: parsed.data.reason === "filled" ? S.toasts.filled : S.toasts.closed };
  });
}

const reopenSchema = z.object({ id: uuid, closesOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, S.validation.closesInPast) });

export async function reopenVacancy(input: { id: string; closesOn: string }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = reopenSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    if (parsed.data.closesOn <= amsterdamDateKey(new Date())) {
      return actionError("ongeldig", { closesOn: [S.validation.closesInPast] });
    }
    const closesIso = amsterdamDateEndToIso(parsed.data.closesOn);
    const result = await transition(ctx, parsed.data.id, ["closed"], "published", { closes_at: closesIso });
    if (!result.ok) return result;
    revalidateVacancies([result.data!.current.number], "visibility");
    refresh();
    return { ok: true, toast: fill(S.toasts.reopened, { datum: formatDateNl(closesIso) }) };
  });
}

export async function extendVacancy(input: { id: string }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const { id } = idSchema.parse(input);
    const current = await loadCurrent(ctx, id);
    if (!current) return actionError("niet_gevonden");
    if (current.status !== "published") {
      refresh();
      return actionError("ongeldige_overgang");
    }
    const base = Math.max(current.closes_at ? Date.parse(current.closes_at) : 0, Date.now());
    const closesIso = new Date(base + VACANCY_EXTEND_DAYS * DAY).toISOString();
    const { error } = await ctx.supabase.from("vacancies").update({ closes_at: closesIso }).eq("id", id);
    if (error) return mapDbError(error);
    revalidateVacancies([current.number], extendRevalidationKind(current.publicState) ?? "content");
    refresh();
    return { ok: true, toast: fill(S.toasts.extended, { datum: formatDateNl(closesIso) }) };
  });
}

export async function archiveVacancy(input: { id: string }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const { id } = idSchema.parse(input);
    const result = await transition(ctx, id, ["draft", "closed"], "archived");
    if (!result.ok) return result;
    if (result.data!.current.status === "closed") revalidateVacancies([result.data!.current.number], "visibility");
    refresh();
    return { ok: true, toast: S.toasts.archived };
  });
}

export async function restoreVacancy(input: { id: string }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const { id } = idSchema.parse(input);
    const result = await transition(ctx, id, ["archived"], "draft");
    if (!result.ok) return result;
    refresh();
    return { ok: true, toast: S.toasts.restored };
  });
}

export async function duplicateVacancy(input: { id: string }): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const { id } = idSchema.parse(input);
    const { data, error } = await ctx.supabase.rpc("duplicate_vacancy", { p_id: id });
    if (error) return mapDbError(error);
    const row = data?.[0];
    if (!row) return actionError("niet_gevonden");
    redirect(`${beheerPaths.vacancy(row.vacancy_number)}?melding=gedupliceerd`);
  });
}

/** Alleen eigenaar; alleen een concept zonder sollicitaties. Anders fieldErrors._blocked. */
export async function deleteVacancy(input: { id: string }): Promise<ActionResult> {
  return withAdmin(
    async (ctx) => {
      const { id } = idSchema.parse(input);
      const { data, error } = await ctx.supabase
        .from("vacancies")
        .delete()
        .eq("id", id)
        .eq("status", "draft")
        .select("id");
      if (error) return mapDbError(error);
      if (!data || data.length === 0) {
        return { ok: false, code: "ongeldig", message: S.dialogs.deleteBlocked.body, fieldErrors: { _blocked: ["1"] } };
      }
      redirect(`${beheerPaths.vacancies}?melding=verwijderd`);
    },
    { ownerOnly: true },
  );
}

const flagSchema = z.object({ id: uuid, flag: z.enum(["is_featured", "is_urgent"]), value: z.boolean() });

export async function setVacancyFlag(input: {
  id: string;
  flag: "is_featured" | "is_urgent";
  value: boolean;
}): Promise<ActionResult> {
  return withAdmin(async (ctx) => {
    const parsed = flagSchema.safeParse(input);
    if (!parsed.success) return actionError("ongeldig", fieldErrorsOf(parsed.error));
    const current = await loadCurrent(ctx, parsed.data.id);
    if (!current) return actionError("niet_gevonden");
    const update = parsed.data.flag === "is_featured" ? { is_featured: parsed.data.value } : { is_urgent: parsed.data.value };
    const { error } = await ctx.supabase.from("vacancies").update(update).eq("id", current.id);
    if (error) return mapDbError(error);
    if (current.publicState) revalidateVacancies([current.number], "content");
    refresh();
    const toast =
      parsed.data.flag === "is_featured"
        ? parsed.data.value
          ? S.toasts.featured
          : S.toasts.unfeatured
        : parsed.data.value
          ? S.toasts.urgentOn
          : S.toasts.urgentOff;
    return { ok: true, toast };
  });
}
