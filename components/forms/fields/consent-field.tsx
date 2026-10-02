"use client";

import { CheckboxField } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { fieldIds } from "./field-label";

type ConsentFieldProps = {
  formId: string;
  name: string;
  label: React.ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Nooit vooraf aangevinkt; alleen om de keuze na een serverfout terug te zetten. */
  defaultChecked?: boolean;
  onChange?: () => void;
};

/** Toestemmingsvinkje met hint en fout (spec 07 §4.3, spec 09 §4.8). */
export function ConsentField({ formId, name, label, hint, error, required, defaultChecked, onChange }: ConsentFieldProps) {
  const ids = fieldIds(formId, name);
  return (
    <div className="grid gap-1" onChange={onChange}>
      <CheckboxField
        id={ids.id}
        name={name}
        value="on"
        label={label}
        description={hint}
        defaultChecked={defaultChecked}
        required={required}
        invalid={Boolean(error)}
        describedBy={error ? ids.errorId : undefined}
      />
      <FieldError id={ids.errorId}>{error}</FieldError>
    </div>
  );
}
