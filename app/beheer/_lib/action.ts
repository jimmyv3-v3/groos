import "server-only";
import { unstable_rethrow } from "next/navigation";
import type { Json } from "@/lib/database.types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { S } from "../_strings";
import { getSessionState, type AdminContext } from "./auth";
import { isPublishErrorCode } from "./types";
import type { ActionResult, BeheerErrorCode } from "./result";

export type { ActionResult, BeheerErrorCode } from "./result";

function fail(code: BeheerErrorCode, fieldErrors?: Record<string, string[]>): ActionResult<never> {
  return { ok: false, code, message: S.errors[code], ...(fieldErrors ? { fieldErrors } : {}) };
}

export { fail as actionError };

/**
 * Eerste regel van elke beheeractie (spec 08 §5.3). Controleert sessie, aal2,
 * actief profiel en bij ownerOnly de rol. Vangt fouten af met mapDbError.
 */
export async function withAdmin<T>(
  run: (ctx: AdminContext) => Promise<ActionResult<T>>,
  opts?: { ownerOnly?: boolean },
): Promise<ActionResult<T>> {
  const state = await getSessionState();
  if (state.kind === "none") return fail("sessie_verlopen");
  if (state.kind === "aal1") return fail("mfa_vereist");
  if (state.kind === "inactive") return fail("geen_toegang");
  if (opts?.ownerOnly && state.ctx.profile.role !== "owner") return fail("geen_rechten");
  try {
    return await run(state.ctx);
  } catch (error) {
    unstable_rethrow(error);
    return mapDbError(error as { code?: string; message?: string });
  }
}

/** Vertaalt Supabase- en Postgres-fouten naar BeheerErrorCode en een tekst uit S.errors (§6.4). */
export function mapDbError(error: { code?: string; message?: string; status?: number } | null | undefined): ActionResult<never> {
  const code = error?.code ?? "";
  const message = error?.message ?? "";

  if (message.startsWith("vacancy_not_publishable:")) {
    const codes = message.slice("vacancy_not_publishable:".length).split(",").filter(isPublishErrorCode);
    return fail("niet_publiceerbaar", publishFieldErrors(codes));
  }
  if (message.startsWith("vacancy_invalid_transition")) return fail("ongeldige_overgang");
  if (message.startsWith("vacancy_not_found") || code === "PGRST116" || code === "P0002") return fail("niet_gevonden");
  if (message.includes("not_admin") || message.includes("permission denied") || code === "42501") {
    return fail("geen_rechten");
  }
  if (code === "23514" || code === "23503" || code === "22P02" || code === "23502") return fail("ongeldig");
  if (code === "invalid_credentials") return authFail(S.auth.errors.invalidCredentials);
  if (code === "mfa_verification_failed" || code === "mfa_challenge_expired") return authFail(S.auth.errors.invalidCode);
  if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit" || error?.status === 429) {
    return authFail(S.auth.errors.tooManyAttempts);
  }
  if (code === "weak_password") return authFail(S.auth.errors.passwordWeak);
  if (code === "same_password") return authFail(S.auth.errors.passwordSame);
  if (code === "session_not_found" || code === "session_expired") return fail("sessie_verlopen");
  if (code === "insufficient_aal") return fail("mfa_vereist");

  console.error(`[beheer] onbekende fout: ${code || "zonder code"}`);
  return fail("onbekend");
}

function authFail(message: string): ActionResult<never> {
  return { ok: false, code: "ongeldig", message };
}

/** Veldfouten per publicatiecode, met de veldnaam uit het formulier als sleutel. */
export function publishFieldErrors(codes: readonly string[]): Record<string, string[]> {
  const fieldFor: Record<string, string> = {
    title: "title",
    city: "city",
    hours: "hours_min",
    salary: "salary_min",
    intro: "intro",
    tasks: "tasks",
    requirements: "requirements",
    offer: "offer",
    start: "start_date",
    contact: "contact_admin_id",
    publish_at: "publish_at",
  };
  const out: Record<string, string[]> = {};
  for (const c of codes) {
    if (!isPublishErrorCode(c)) continue;
    const field = fieldFor[c];
    out[field] = [...(out[field] ?? []), S.validation.publish[c]];
  }
  return out;
}

/** Schrijft een regel in audit_log via de admin-client, voor gebeurtenissen zonder tabelwijziging (§5.4). */
export async function writeAdminAudit(input: {
  actorId: string;
  action: `admin.${string}`;
  changes?: Record<string, unknown>;
}): Promise<void> {
  try {
    const { error } = await createSupabaseAdminClient()
      .from("audit_log")
      .insert({
        actor_id: input.actorId,
        actor_type: "admin",
        action: input.action,
        entity_type: "admin_profile",
        entity_id: input.actorId,
        changes: (input.changes ?? null) as Json,
      });
    if (error) console.error(`[beheer] audit_log ${input.action} niet opgeslagen: ${error.code ?? ""}`);
  } catch (error) {
    console.error(`[beheer] audit_log ${input.action} niet opgeslagen`, error instanceof Error ? error.message : "");
  }
}
