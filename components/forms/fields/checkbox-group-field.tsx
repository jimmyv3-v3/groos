"use client";

import { CircleAlert } from "lucide-react";
import { CheckboxField } from "@/components/ui/checkbox";
import { FieldDescription, FieldSet } from "@/components/ui/field";
import { FieldLabelText, fieldIds } from "./field-label";

type CheckboxGroupFieldProps = {
  formId: string;
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  defaultValue?: string[];
  onValuesChange?: (values: string[]) => void;
};

export const choiceCardClasses =
  "rounded-lg border border-input bg-background px-4 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-brand-tint";

/** Meerdere keuzes met dezelfde name, zodat formData.getAll(name) werkt (spec 07 §4.3). */
export function CheckboxGroupField({
  formId,
  name,
  legend,
  hint,
  error,
  options,
  defaultValue = [],
  onValuesChange,
}: CheckboxGroupFieldProps) {
  const ids = fieldIds(formId, name);
  const described = [hint ? ids.hintId : null, error ? ids.errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <FieldSet
      aria-invalid={error ? true : undefined}
      aria-describedby={described}
      className="min-w-0 gap-3"
      onChange={(e) => {
        const form = (e.target as unknown as HTMLInputElement).form;
        if (!form || (e.target as unknown as HTMLInputElement).name !== name) return;
        onValuesChange?.(new FormData(form).getAll(name).map(String));
      }}
    >
      <legend className="mb-1 text-sm font-medium text-foreground">
        <FieldLabelText label={legend} />
      </legend>
      {hint && (
        <FieldDescription id={ids.hintId} className="-mt-1">
          {hint}
        </FieldDescription>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <CheckboxField
            key={o.value}
            id={`${ids.id}-${o.value}`}
            name={name}
            value={o.value}
            label={o.label}
            defaultChecked={defaultValue.includes(o.value)}
            className={choiceCardClasses}
          />
        ))}
      </div>
      {error && (
        <p id={ids.errorId} role="alert" className="flex gap-1.5 text-sm font-medium text-destructive">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </FieldSet>
  );
}
