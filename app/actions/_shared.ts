import "server-only";
import { track } from "@vercel/analytics/server";
import type { OccupationSlug } from "@/lib/data/options";
import { isBotRequest } from "@/lib/security/botid";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LINK_LIMIT, MIN_FILL_MS, countLinks, type FormId } from "@/lib/validation/shared";

/** Gedeelde stappen van de Server Actions (spec 07 §5.5). */

/** BotID, honeypot, invultijd en linkcontrole. */
export async function guardSubmission(
  meta: { website?: unknown; fillMs?: unknown },
  texts: (string | undefined)[],
): Promise<"ok" | "blocked"> {
  if (await isBotRequest()) return "blocked";
  if (typeof meta.website === "string" && meta.website.trim() !== "") return "blocked";
  if (meta.fillMs !== undefined) {
    const fillMs = Number(meta.fillMs);
    // Zonder JavaScript ontbreekt fillMs: dan geen controle op de invultijd.
    if (!Number.isFinite(fillMs) || fillMs < MIN_FILL_MS) return "blocked";
  }
  const links = texts.reduce((sum, text) => sum + countLinks(text), 0);
  if (links >= LINK_LIMIT) return "blocked";
  return "ok";
}

/** Kleine letters, alleen [a-z0-9._-], hoogstens 100 tekens; null als alles leeg is. */
export function buildUtm(meta: {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): { source?: string; medium?: string; campaign?: string } | null {
  const clean = (value: string | undefined) => {
    const v = value
      ?.toLowerCase()
      .replace(/[^a-z0-9._-]/g, "")
      .slice(0, 100);
    return v ? v : undefined;
  };
  const utm = { source: clean(meta.utmSource), medium: clean(meta.utmMedium), campaign: clean(meta.utmCampaign) };
  const entries = Object.entries(utm).filter(([, v]) => v !== undefined);
  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

/** Bestaand record met dezelfde submission_id (dubbele inzending). */
export async function findBySubmissionId(
  table: "applications" | "staff_requests" | "contact_messages",
  id: string,
): Promise<{ id: string; reference: string | null } | null> {
  const db = createSupabaseAdminClient();
  if (table === "contact_messages") {
    const { data } = await db.from(table).select("id").eq("submission_id", id).maybeSingle();
    return data ? { id: data.id, reference: null } : null;
  }
  const { data } = await db.from(table).select("id, reference").eq("submission_id", id).maybeSingle();
  return data ? { id: data.id, reference: data.reference } : null;
}

/** console.error met alleen formulier, code en Postgres-code; nooit invoer of persoonsgegevens. */
export function logFormFailure(form: FormId, code: string, detail?: { pgCode?: string }): void {
  console.error(`[formulier] ${form} ${code}`, detail?.pgCode ? { pgCode: detail.pgCode } : "");
}

/** track("form_submit") aan de serverkant; fouten worden ingeslikt. */
export async function trackSubmit(props: { form: FormId; beroep?: OccupationSlug; vacature?: number }): Promise<void> {
  try {
    const properties: Record<string, string | number> = { form: props.form };
    if (props.beroep) properties.beroep = props.beroep;
    if (props.vacature !== undefined) properties.vacature = props.vacature;
    await track("form_submit", properties);
  } catch {
    // Analytics mag een inzending nooit raken.
  }
}
