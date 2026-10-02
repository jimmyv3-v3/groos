"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { CtaButton, type CtaButtonProps } from "@/components/ui/cta-button";
import { S } from "@/app/beheer/_strings";

/** Verzendknop met laadstaat via useFormStatus (spec 08 §4.3). */
export function SubmitButton({
  children,
  pendingLabel,
  ...props
}: { children: ReactNode; pendingLabel?: string } & Omit<
  CtaButtonProps,
  "href" | "type" | "pending" | "pendingLabel" | "children"
>) {
  const { pending } = useFormStatus();
  return (
    <CtaButton {...props} type="submit" pending={pending} pendingLabel={pendingLabel ?? S.common.saving}>
      {children}
    </CtaButton>
  );
}
