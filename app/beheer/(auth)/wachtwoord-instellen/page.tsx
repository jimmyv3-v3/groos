import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/beheer/auth/auth-card";
import { PasswordSetForm } from "@/components/beheer/auth/password-set-form";
import { getSessionState } from "../../_lib/auth";
import { beheerPaths } from "../../_lib/paths";
import { S } from "../../_strings";

export const metadata: Metadata = { title: S.auth.setPassword.metaTitle };

/**
 * /beheer/wachtwoord-instellen (spec 08 §4.5). Supabase vraagt aal2 om het
 * wachtwoord van een account met een factor te wijzigen; dus eerst de code.
 */
export default async function SetPasswordPage() {
  const state = await getSessionState();
  if (state.kind === "none") redirect(beheerPaths.login);
  if (state.kind === "aal1" && state.hasVerifiedFactor) {
    redirect(`${beheerPaths.mfa}?volgende=${encodeURIComponent(beheerPaths.setPassword)}`);
  }
  if (state.kind === "inactive") redirect(beheerPaths.noAccess);

  return (
    <AuthCard title={S.auth.setPassword.title} intro={S.auth.setPassword.intro}>
      <PasswordSetForm />
    </AuthCard>
  );
}
