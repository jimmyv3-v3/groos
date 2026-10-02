"use client";

import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { FieldLabel, describedBy, fieldIds } from "./field-label";

type SelectFieldProps = {
  formId: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  onChange?: () => void;
};

/** Native keuzelijst (spec 07 §4.3). */
export function SelectField({ formId, name, label, hint, error, options, defaultValue, onChange }: SelectFieldProps) {
  const ids = fieldIds(formId, name);
  return (
    <Field invalid={Boolean(error)}>
      <FieldLabel htmlFor={ids.id} label={label} required />
      <NativeSelect
        id={ids.id}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, hint, error)}
        onChange={onChange}
      >
        {options.map((o) => (
          <NativeSelectOption key={o.value} value={o.value}>
            {o.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {hint && <FieldDescription id={ids.hintId}>{hint}</FieldDescription>}
      <FieldError id={ids.errorId}>{error}</FieldError>
    </Field>
  );
}
