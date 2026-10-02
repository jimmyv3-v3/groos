import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/beheer/auth/auth-card";
import { PasswordResetForm } from "@/components/beheer/auth/password-reset-form";
import { beheerPaths } from "../../_lib/paths";
import { S } from "../../_strings";

export const metadata: Metadata = { title: S.auth.forgot.metaTitle };

/** /beheer/wachtwoord-vergeten (spec 08 §4.5). */
export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title={S.auth.forgot.title}
      intro={S.auth.forgot.intro}
      footer={
        <Link href={beheerPaths.login} className="link inline-flex min-h-11 items-center">
          {S.auth.forgot.backToLogin}
        </Link>
      }
    >
      <PasswordResetForm />
    </AuthCard>
  );
}
