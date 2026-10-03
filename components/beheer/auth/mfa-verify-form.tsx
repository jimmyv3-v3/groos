"use client";

import { verifyMfa } from "@/app/beheer/_actions/auth";
import { S } from "@/app/beheer/_strings";
import { useActionForm } from "@/components/beheer/use-action-form";
import { Alert } from "@/components/ui/alert";
import { CtaButton } from "@/components/ui/cta-button";
import { OtpField } from "./otp-field";

/** Code uit de authenticator-app bevestigen (spec 08 §4.5). */
export function MfaVerifyForm({ volgende }: { volgende?: string }) {
  const { state, formAction, onSubmit, pending, fieldErrors } = useActionForm(verifyMfa);
  return (
    <form action={formAction} onSubmit={onSubmit} className="grid gap-5" noValidate>
      {state && !state.ok && !state.fieldErrors && (
        <Alert tone="danger" role="alert">
          {state.message}
        </Alert>
      )}
      <input type="hidden" name="volgende" value={volgende ?? ""} />
      <OtpField name="code" label={S.auth.mfa.code} hint={S.auth.mfa.codeHint} error={fieldErrors.code} />
      <CtaButton type="submit" pending={pending} pendingLabel={S.common.saving} className="w-full">
        {S.auth.mfa.submit}
      </CtaButton>
    </form>
  );
}
