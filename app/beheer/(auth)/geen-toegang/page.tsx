import type { Metadata } from "next";
import { AuthCard } from "@/components/beheer/auth/auth-card";
import { SignOutButton } from "@/components/beheer/sign-out-button";
import { S } from "../../_strings";

export const metadata: Metadata = { title: S.auth.noAccess.title };

/** Voor een account zonder actief profiel in admin_profiles (spec 08 §4.5). */
export default function NoAccessPage() {
  return (
    <AuthCard title={S.auth.noAccess.title} intro={S.auth.noAccess.body}>
      <SignOutButton variant="primary" className="w-full">
        {S.app.signOut}
      </SignOutButton>
    </AuthCard>
  );
}
