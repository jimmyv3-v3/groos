"use client";

import { requestPasswordReset } from "@/app/beheer/_actions/auth";
import { S } from "@/app/beheer/_strings";
import { BeheerField } from "@/components/beheer/beheer-field";
import { useActionForm } from "@/components/beheer/use-action-form";
import { Alert } from "@/components/ui/alert";
import { CtaButton } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";

/** Herstelmail aanvragen; altijd dezelfde bevestiging (spec 08 §4.5). */
export function PasswordResetForm() {
  const { state, formAction, onSubmit, pending, fieldErrors } = useActionForm(requestPasswordReset);
  if (state?.ok) {
    return (
      <Alert tone="success" role="status">
        {S.auth.forgot.sent}
      </Alert>
    );
  }
  return (
    <form action={formAction} onSubmit={onSubmit} className="grid gap-5" noValidate>
      {state && !state.ok && !state.fieldErrors && (
        <Alert tone="danger" role="alert">
          {state.message}
        </Alert>
      )}
      <BeheerField id="email" label={S.auth.login.email} error={fieldErrors.email} required="always">
        <Input name="email" type="email" autoComplete="username" inputMode="email" required />
      </BeheerField>
      <CtaButton type="submit" pending={pending} pendingLabel={S.common.saving} className="w-full">
        {S.auth.forgot.submit}
      </CtaButton>
    </form>
  );
}
