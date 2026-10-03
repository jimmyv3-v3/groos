"use server";

import { redirect } from "next/navigation";
import { isBotRequest } from "@/lib/security/botid";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { actionError, mapDbError, writeAdminAudit } from "../_lib/action";
import { beheerOrigin, beheerPaths, safeNext } from "../_lib/paths";
import type { ActionResult } from "../_lib/result";
import { emailSchema, loginSchema, otpSchema, passwordSchema } from "../_lib/validation/auth";
import { fieldErrorsOf } from "../_lib/validation/common";
import { S } from "../_strings";

/**
 * Auth-acties van spec 08 §5.3 tabel 1. Zonder withAdmin: ze werken juist
 * voordat er een aal2-sessie is.
 */

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
};

function invalid(fieldErrors: Record<string, string[]>): ActionResult<never> {
  return { ok: false, code: "ongeldig", message: S.errors.ongeldig, fieldErrors };
}

function genericAuthError(): ActionResult<never> {
  return { ok: false, code: "onbekend", message: S.auth.errors.generic };
}

export async function signIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: str(formData, "email"),
    password: str(formData, "password"),
    volgende: str(formData, "volgende") || undefined,
  });
  if (!parsed.success) return invalid(fieldErrorsOf(parsed.error));
  if (await isBotRequest()) return { ok: false, code: "bot", message: S.auth.errors.bot };
  if (!hasSupabaseEnv()) return genericAuthError();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error || !data.user) {
    const mapped = mapDbError(error ?? undefined);
    return mapped.ok || mapped.code === "onbekend" ? genericAuthError() : mapped;
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("is_active")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!profile?.is_active) {
    await supabase.auth.signOut({ scope: "local" });
    return { ok: false, code: "geen_toegang", message: S.auth.errors.deactivated };
  }

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const verified = (factors?.totp ?? []).some((f) => f.status === "verified");
  const next = safeNext(parsed.data.volgende);
  if (verified) redirect(`${beheerPaths.mfa}?volgende=${encodeURIComponent(next)}`);
  redirect(beheerPaths.mfaEnroll);
}

export async function verifyMfa(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = otpSchema.safeParse({ code: str(formData, "code") });
  if (!parsed.success) return invalid(fieldErrorsOf(parsed.error));
  if (!hasSupabaseEnv()) return actionError("sessie_verlopen");

  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (typeof userId !== "string") return actionError("sessie_verlopen");

  const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
  if (listError) return mapDbError(listError);
  const factor = (factors?.totp ?? []).find((f) => f.status === "verified");
  if (!factor) redirect(beheerPaths.mfaEnroll);

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code: parsed.data.code });
  if (error) {
    const mapped = mapDbError(error);
    return mapped.ok ? genericAuthError() : { ...mapped, fieldErrors: { code: [mapped.message] } };
  }

  await supabase.from("admin_profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", userId);
  await writeAdminAudit({ actorId: userId, action: "admin.signed_in" });
  redirect(safeNext(str(formData, "volgende")));
}

export async function startMfaEnrollment(): Promise<
  ActionResult<{ factorId: string; qrCode: string; secret: string }>
> {
  if (!hasSupabaseEnv()) return actionError("sessie_verlopen");
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (typeof claims?.claims?.sub !== "string") return actionError("sessie_verlopen");

  const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
  if (listError) return mapDbError(listError);
  for (const f of factors?.all ?? []) {
    if (f.factor_type === "totp" && f.status !== "verified") {
      await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Groos Beheer",
    issuer: "Groos Beheer",
  });
  if (error || !data) return mapDbError(error ?? undefined);
  return {
    ok: true,
    toast: "",
    data: { factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret },
  };
}

export async function confirmMfaEnrollment(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = otpSchema.safeParse({ code: str(formData, "code") });
  if (!parsed.success) return invalid(fieldErrorsOf(parsed.error));
  const factorId = str(formData, "factorId");
  if (!factorId || !hasSupabaseEnv()) return actionError("sessie_verlopen");

  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (typeof userId !== "string") return actionError("sessie_verlopen");

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: parsed.data.code });
  if (error) {
    const mapped = mapDbError(error);
    return mapped.ok ? genericAuthError() : { ...mapped, fieldErrors: { code: [mapped.message] } };
  }
  await writeAdminAudit({ actorId: userId, action: "admin.mfa_enrolled" });
  redirect(`${beheerPaths.home}?melding=welkom`);
}

export async function requestPasswordReset(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  // B-50: een bot krijgt dezelfde bevestiging, zonder aanroep van Supabase.
  if (await isBotRequest()) return { ok: true, toast: S.auth.forgot.sent };
  const parsed = emailSchema.safeParse({ email: str(formData, "email") });
  if (!parsed.success) return invalid(fieldErrorsOf(parsed.error));
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${beheerOrigin()}${beheerPaths.confirm}?volgende=${beheerPaths.setPassword}`,
    });
    if (error && (error.status === 429 || error.code === "over_email_send_rate_limit")) {
      return { ok: false, code: "ongeldig", message: S.auth.errors.tooManyAttempts };
    }
  }
  // Altijd dezelfde bevestiging, ook voor een onbekend adres.
  return { ok: true, toast: S.auth.forgot.sent };
}

export async function setPassword(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = passwordSchema.safeParse({
    password: str(formData, "password"),
    passwordConfirm: str(formData, "passwordConfirm"),
  });
  if (!parsed.success) return invalid(fieldErrorsOf(parsed.error));
  if (!hasSupabaseEnv()) return actionError("sessie_verlopen");

  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (typeof userId !== "string") return actionError("sessie_verlopen");

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    const mapped = mapDbError(error);
    if (mapped.ok) return genericAuthError();
    return error.code === "weak_password" || error.code === "same_password"
      ? { ...mapped, fieldErrors: { password: [mapped.message] } }
      : mapped;
  }
  await writeAdminAudit({ actorId: userId, action: "admin.password_changed" });

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const verified = (factors?.totp ?? []).some((f) => f.status === "verified");
  if (!verified) redirect(beheerPaths.mfaEnroll);
  redirect(`${beheerPaths.home}?melding=wachtwoord`);
}

export async function signOut(formData: FormData): Promise<void> {
  const scope = formData.get("scope") === "global" ? "global" : "local";
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (typeof userId === "string") await writeAdminAudit({ actorId: userId, action: "admin.signed_out" });
    await supabase.auth.signOut({ scope });
  }
  redirect(`${beheerPaths.login}?melding=uitgelogd`);
}
