"use client";

import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel, describedBy, fieldIds } from "./field-label";

type TextareaFieldProps = {
  formId: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string;
  maxLength: number;
  rows?: number;
  autoFocus?: boolean;
  onChange?: () => void;
};

/** Meerregelig veld zonder teller, wel met maxLength (spec 07 §4.3). */
export function TextareaField({
  formId,
  name,
  label,
  hint,
  error,
  required,
  defaultValue,
  maxLength,
  rows = 4,
  autoFocus,
  onChange,
}: TextareaFieldProps) {
  const ids = fieldIds(formId, name);
  return (
    <Field invalid={Boolean(error)}>
      <FieldLabel htmlFor={ids.id} label={label} required={required} />
      <Textarea
        id={ids.id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        maxLength={maxLength}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, hint, error)}
        autoFocus={autoFocus}
        onChange={onChange}
      />
      {hint && <FieldDescription id={ids.hintId}>{hint}</FieldDescription>}
      <FieldError id={ids.errorId}>{error}</FieldError>
    </Field>
  );
}
