import type { Metadata } from "next";
import { AuthCard } from "@/components/beheer/auth/auth-card";
import { LoginForm } from "@/components/beheer/auth/login-form";
import { firstParam } from "../../_lib/validation/common";
import { S } from "../../_strings";

export const metadata: Metadata = { title: S.auth.login.metaTitle };

/** /beheer/inloggen (spec 08 §4.5). De proxy stuurt met een aal2-sessie door naar /beheer. */
export default async function LoginPage({ searchParams }: PageProps<"/beheer/inloggen">) {
  const params = await searchParams;
  const melding = firstParam(params.melding);
  const notices = S.auth.notices as Record<string, string>;
  const notice = melding && Object.hasOwn(notices, melding) ? notices[melding] : undefined;
  return (
    <AuthCard title={S.auth.login.title} intro={S.auth.login.intro}>
      <LoginForm volgende={firstParam(params.volgende)} notice={notice} />
    </AuthCard>
  );
}
