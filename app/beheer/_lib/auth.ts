import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient, type SupabaseServerClient } from "@/lib/supabase/server";
import { beheerPaths } from "./paths";
import type { AdminRole } from "./types";

export type AdminProfile = {
  id: string;
  email: string;
  fullName: string;
  displayName: string;
  role: AdminRole;
  phoneE164: string | null;
  whatsappE164: string | null;
};

export type AdminContext = { supabase: SupabaseServerClient; userId: string; profile: AdminProfile };

export type SessionState =
  | { kind: "none" }
  /** Het account heeft een gekoppelde app, maar de code is deze sessie nog niet gegeven. */
  | { kind: "aal1"; supabase: SupabaseServerClient; userId: string }
  | { kind: "inactive"; supabase: SupabaseServerClient; userId: string }
  | { kind: "admin"; ctx: AdminContext; mfaEnabled: boolean };

/**
 * Eén keer per request: getClaims(), daarna het eigen profiel (leesbaar zonder
 * aal2, spec 10 §5.8) en bij aal1 mfa.listFactors(). Tweestapsverificatie is
 * per account optioneel (B-62): zonder geverifieerde factor volstaat aal1,
 * gelijk aan is_admin() in de database.
 */
export const getSessionState = cache(async (): Promise<SessionState> => {
  if (!hasSupabaseEnv()) return { kind: "none" };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims || typeof claims.sub !== "string") return { kind: "none" };
  const userId = claims.sub;

  const { data: row, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id, email, full_name, display_name, role, phone_e164, whatsapp_e164, is_active")
    .eq("id", userId)
    .maybeSingle();
  if (profileError) console.error(`[beheer] profiel niet gelezen: ${profileError.code ?? ""}`);
  if (!row || !row.is_active) return { kind: "inactive", supabase, userId };

  const mfaEnabled = claims.aal === "aal2";
  if (!mfaEnabled) {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const hasVerifiedFactor = (factors?.totp ?? []).some((f) => f.status === "verified");
    if (hasVerifiedFactor) return { kind: "aal1", supabase, userId };
  }

  return {
    kind: "admin",
    mfaEnabled,
    ctx: {
      supabase,
      userId,
      profile: {
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        displayName: row.display_name,
        role: row.role,
        phoneE164: row.phone_e164,
        whatsappE164: row.whatsapp_e164,
      },
    },
  };
});

/** Voor de (app)-layout en elke (app)-pagina. none: inloggen; aal1: mfa; inactive: geen toegang. */
export async function requireAdmin(): Promise<AdminContext> {
  const state = await getSessionState();
  switch (state.kind) {
    case "none":
      redirect(beheerPaths.login);
    case "aal1":
      redirect(beheerPaths.mfa);
    case "inactive":
      redirect(beheerPaths.noAccess);
    case "admin":
      return state.ctx;
  }
}
