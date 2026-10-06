"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Copy } from "lucide-react";
import { confirmMfaEnrollment, startMfaEnrollment } from "@/app/beheer/_actions/auth";
import { S } from "@/app/beheer/_strings";
import { useActionForm } from "@/components/beheer/use-action-form";
import { Alert } from "@/components/ui/alert";
import { CtaButton } from "@/components/ui/cta-button";
import { OtpField } from "./otp-field";

type Enrollment = { factorId: string; qrCode: string; secret: string };

/**
 * Koppelen in drie genummerde stappen (spec 08 §4.5). Opbouw naar 21st.dev
 * 5751 (ahmedmayara, Enable 2FA Card); de sleutel met kopieerknop naar 29246.
 * Bewust een knop en geen automatische start, zodat StrictMode niet twee
 * factoren aanmaakt.
 */
export function MfaEnroll() {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [starting, startTransition] = useTransition();
  const { state, formAction, onSubmit, pending, fieldErrors } = useActionForm(confirmMfaEnrollment);

  const start = () =>
    startTransition(async () => {
      setStartError(null);
      setCopied(false);
      const result = await startMfaEnrollment();
      if (result.ok && result.data) setEnrollment(result.data);
      else setStartError(result.ok ? S.auth.errors.generic : result.message);
    });

  const steps = [S.auth.enroll.step1, S.auth.enroll.step2, S.auth.enroll.step3];
  const groupedSecret = enrollment?.secret.match(/.{1,4}/g)?.join(" ") ?? "";

  return (
    <div className="grid gap-6">
      <ol className="grid gap-3">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="inline-grid size-7 shrink-0 place-items-center rounded-full bg-brand-tint text-sm font-semibold text-brand-strong">
              {i + 1}
            </span>
            <span className="pt-0.5 text-base">{step}</span>
          </li>
        ))}
      </ol>

      {startError && (
        <Alert tone="danger" role="alert">
          {startError}
        </Alert>
      )}

      {!enrollment ? (
        <CtaButton onClick={start} pending={starting} pendingLabel={S.common.saving} className="w-full">
          {S.auth.enroll.start}
        </CtaButton>
      ) : (
        <div className="grid gap-5">
          <div className="grid justify-items-center gap-4 rounded-xl border border-border bg-background p-4">
            <Image
              src={enrollment.qrCode}
              alt={S.auth.enroll.qrAlt}
              width={200}
              height={200}
              unoptimized
              className="h-auto w-[200px] max-w-full"
            />
            <div className="grid w-full gap-2">
              <p className="text-sm text-muted-foreground">{S.auth.enroll.manualLabel}</p>
              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 rounded-lg bg-muted px-3 py-2.5 font-mono text-base break-words select-all">{groupedSecret}</code>
                <CtaButton
                  variant="secondary"
                  size="icon"
                  ariaLabel={S.auth.enroll.copySecret}
                  onClick={() => {
                    void navigator.clipboard?.writeText(enrollment.secret).then(() => setCopied(true));
                  }}
                >
                  <Copy aria-hidden="true" />
                </CtaButton>
              </div>
              <p aria-live="polite" className="min-h-5 text-sm text-success-strong">
                {copied ? S.common.copied : ""}
              </p>
            </div>
          </div>

          <form action={formAction} onSubmit={onSubmit} className="grid gap-5" noValidate>
            {state && !state.ok && !state.fieldErrors && (
              <Alert tone="danger" role="alert">
                {state.message}
              </Alert>
            )}
            <input type="hidden" name="factorId" value={enrollment.factorId} />
            <OtpField name="code" label={S.auth.mfa.code} hint={S.auth.mfa.codeHint} error={fieldErrors.code} />
            <CtaButton type="submit" pending={pending} pendingLabel={S.common.saving} className="w-full">
              {S.auth.enroll.submit}
            </CtaButton>
          </form>
          <CtaButton variant="link" onClick={start} disabled={starting} className="justify-self-start">
            {S.auth.enroll.restart}
          </CtaButton>
        </div>
      )}
    </div>
  );
}
