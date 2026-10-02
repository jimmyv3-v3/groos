"use client";

import { setPassword } from "@/app/beheer/_actions/auth";
import { S } from "@/app/beheer/_strings";
import { BeheerField } from "@/components/beheer/beheer-field";
import { useActionForm } from "@/components/beheer/use-action-form";
import { Alert } from "@/components/ui/alert";
import { CtaButton } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";

/** Nieuw wachtwoord van minimaal 12 tekens (spec 08 §4.5). Opbouw naar 21st.dev 29241. */
export function PasswordSetForm() {
  const { state, formAction, onSubmit, pending, fieldErrors } = useActionForm(setPassword);
  return (
    <form action={formAction} onSubmit={onSubmit} className="grid gap-5" noValidate>
      {state && !state.ok && !state.fieldErrors && (
        <Alert tone="danger" role="alert">
          {state.message}
        </Alert>
      )}
      <BeheerField
        id="password"
        label={S.auth.setPassword.password}
        hint={S.auth.errors.passwordTooShort}
        error={fieldErrors.password}
        required="always"
      >
        <Input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required />
      </BeheerField>
      <BeheerField
        id="passwordConfirm"
        label={S.auth.setPassword.passwordConfirm}
        error={fieldErrors.passwordConfirm}
        required="always"
      >
        <Input name="passwordConfirm" type="password" autoComplete="new-password" minLength={12} maxLength={72} required />
      </BeheerField>
      <CtaButton type="submit" pending={pending} pendingLabel={S.common.saving} className="w-full">
        {S.auth.setPassword.submit}
      </CtaButton>
    </form>
  );
}
