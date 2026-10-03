import { cloneElement, isValidElement, type ReactElement } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { S } from "@/app/beheer/_strings";

type ControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

/**
 * Veld met label, hint en fout (spec 08 §4.3). Koppelt aria-describedby en
 * aria-invalid aan het besturingselement. required "publish" toont het
 * kenmerk "nodig om te publiceren"; zonder required staat er "optioneel".
 */
/** aria-kenmerken voor een besturingselement dat de aanroeper zelf plaatst (BeheerField met wrap). */
export function fieldAria(id: string, hint?: string, error?: string[]) {
  const describedBy = [hint ? `${id}-hint` : null, error?.length ? `${id}-fout` : null].filter(Boolean).join(" ");
  return {
    id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error?.length ? true : undefined,
  } as const;
}

export function BeheerField({
  id,
  label,
  hint,
  error,
  required,
  wrap = false,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string[];
  required?: "always" | "publish";
  /** true: children is een omhulling; de aanroeper zet fieldAria() op het besturingselement. */
  wrap?: boolean;
  children: ReactElement;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error?.length ? `${id}-fout` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control = !wrap && isValidElement<ControlProps>(children)
    ? cloneElement(children, {
        id,
        "aria-describedby": describedBy,
        "aria-invalid": errorId ? true : undefined,
      })
    : children;

  return (
    <Field invalid={Boolean(errorId)} id={`veld-${id}`}>
      <FieldLabel htmlFor={id} className="flex flex-wrap items-baseline gap-x-2">
        {label}
        {required === "publish" && (
          <span className="text-xs font-normal text-brand-strong">{S.common.requiredForPublish}</span>
        )}
        {!required && <span className="text-xs font-normal text-muted-foreground">{S.common.optional}</span>}
      </FieldLabel>
      {hint && <FieldDescription id={hintId}>{hint}</FieldDescription>}
      {control}
      {errorId && <FieldError id={errorId}>{error!.join(" ")}</FieldError>}
    </Field>
  );
}
