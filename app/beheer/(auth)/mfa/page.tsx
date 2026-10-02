import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/beheer/auth/auth-card";
import { MfaVerifyForm } from "@/components/beheer/auth/mfa-verify-form";
import { SignOutButton } from "@/components/beheer/sign-out-button";
import { getSessionState } from "../../_lib/auth";
import { beheerPaths, safeNext } from "../../_lib/paths";
import { firstParam } from "../../_lib/validation/common";
import { S } from "../../_strings";

export const metadata: Metadata = { title: S.auth.mfa.metaTitle };

/** /beheer/mfa: code uit de authenticator-app (spec 08 §4.5). */
export default async function MfaPage({ searchParams }: PageProps<"/beheer/mfa">) {
  const volgende = firstParam((await searchParams).volgende);
  const state = await getSessionState();
  if (state.kind === "none") redirect(beheerPaths.login);
  if (state.kind === "admin") redirect(safeNext(volgende));
  if (state.kind === "inactive") redirect(beheerPaths.noAccess);
  if (!state.hasVerifiedFactor) redirect(beheerPaths.mfaEnroll);

  return (
    <AuthCard
      title={S.auth.mfa.title}
      intro={S.auth.mfa.intro}
      footer={
        <>
          <p className="text-muted-foreground">{S.auth.mfa.lostPhone}</p>
          <SignOutButton variant="ghost" className="justify-self-start px-0">
            {S.auth.mfa.otherAccount}
          </SignOutButton>
        </>
      }
    >
      <MfaVerifyForm volgende={volgende} />
    </AuthCard>
  );
}
