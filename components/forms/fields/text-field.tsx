"use client";

import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldLabel, describedBy, fieldIds } from "./field-label";

type TextFieldProps = {
  formId: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "number" | "date";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  /**
   * Hoofdletters van het schermtoetsenbord. "words" voor namen en plaatsen;
   * "none" schakelt ook autocorrectie en spellingcontrole uit. E-mail en
   * telefoon krijgen vanzelf "none".
   */
  autoCapitalize?: "none" | "words" | "sentences";
  /** false: geen autocorrectie en spellingcontrole (namen, plaatsen, bedrijfsnamen). */
  autoCorrect?: boolean;
  defaultValue?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  autoFocus?: boolean;
  onChange?: () => void;
  className?: string;
};

/** Tekstveld op de primitives van spec 02 (spec 07 §4.3). */
export function TextField({
  formId,
  name,
  label,
  hint,
  error,
  required,
  type = "text",
  autoComplete,
  inputMode,
  autoCapitalize,
  autoCorrect,
  defaultValue,
  min,
  max,
  maxLength,
  autoFocus,
  onChange,
  className,
}: TextFieldProps) {
  const ids = fieldIds(formId, name);
  // Het toetsenbord van een telefoon mag een e-mailadres, nummer of naam niet "verbeteren".
  const literal = type === "email" || type === "tel" || inputMode === "numeric";
  const capitalize = autoCapitalize ?? (literal ? "none" : undefined);
  const correct = autoCorrect ?? (literal || capitalize === "none" ? false : undefined);
  return (
    <Field invalid={Boolean(error)} className={cn("content-start", className)}>
      <FieldLabel htmlFor={ids.id} label={label} required={required} />
      <Input
        id={ids.id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        autoCapitalize={type === "text" || type === "email" || type === "tel" ? capitalize : undefined}
        autoCorrect={correct === false ? "off" : undefined}
        spellCheck={correct === false ? false : undefined}
        defaultValue={defaultValue}
        min={min}
        max={max}
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
