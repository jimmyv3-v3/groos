import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/beheer/auth/auth-card";
import { MfaEnroll } from "@/components/beheer/auth/mfa-enroll";
import { SignOutButton } from "@/components/beheer/sign-out-button";
import { getSessionState } from "../../../_lib/auth";
import { beheerPaths } from "../../../_lib/paths";
import { S } from "../../../_strings";

export const metadata: Metadata = { title: S.auth.enroll.metaTitle };

/** /beheer/mfa/koppelen: alleen voor een aal1-sessie zonder geverifieerde factor (spec 08 §4.5). */
export default async function MfaEnrollPage() {
  const state = await getSessionState();
  if (state.kind === "none") redirect(beheerPaths.login);
  if (state.kind === "admin") redirect(beheerPaths.home);
  if (state.kind === "inactive") redirect(beheerPaths.noAccess);
  if (state.hasVerifiedFactor) redirect(beheerPaths.mfa);

  return (
    <AuthCard
      title={S.auth.enroll.title}
      intro={S.auth.enroll.intro}
      footer={
        <SignOutButton variant="ghost" className="justify-self-start px-0">
          {S.auth.mfa.otherAccount}
        </SignOutButton>
      }
    >
      <MfaEnroll />
    </AuthCard>
  );
}
