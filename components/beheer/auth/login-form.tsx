"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/app/beheer/_actions/auth";
import { beheerPaths } from "@/app/beheer/_lib/paths";
import { S } from "@/app/beheer/_strings";
import { BeheerField, fieldAria } from "@/components/beheer/beheer-field";
import { useActionForm } from "@/components/beheer/use-action-form";
import { Alert } from "@/components/ui/alert";
import { CtaButton } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";

/** Inloggen met e-mail en wachtwoord (spec 08 §4.5). Post naar /beheer/inloggen. */
export function LoginForm({ volgende, notice }: { volgende?: string; notice?: string }) {
  const { state, formAction, onSubmit, pending, fieldErrors } = useActionForm(signIn);
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} onSubmit={onSubmit} className="grid gap-5" noValidate>
      {notice && !state && (
        <Alert tone="info" role="status">
          {notice}
        </Alert>
      )}
      {state && !state.ok && !state.fieldErrors && (
        <Alert tone="danger" role="alert">
          {state.message}
        </Alert>
      )}
      <input type="hidden" name="volgende" value={volgende ?? ""} />
      <BeheerField id="email" label={S.auth.login.email} error={fieldErrors.email} required="always">
        <Input name="email" type="email" autoComplete="username" inputMode="email" required />
      </BeheerField>
      <BeheerField id="password" label={S.auth.login.password} error={fieldErrors.password} required="always" wrap>
        <div className="relative">
          <Input
            {...fieldAria("password", undefined, fieldErrors.password)}
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            className="pr-14"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-pressed={show}
            aria-label={show ? S.auth.login.hidePassword : S.auth.login.showPassword}
            className="absolute top-1/2 right-1 inline-grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </BeheerField>
      <CtaButton type="submit" pending={pending} pendingLabel={S.common.saving} className="w-full">
        {S.auth.login.submit}
      </CtaButton>
      <Link href={beheerPaths.forgot} className="link inline-flex min-h-11 items-center justify-self-start text-sm">
        {S.auth.login.forgot}
      </Link>
    </form>
  );
}
