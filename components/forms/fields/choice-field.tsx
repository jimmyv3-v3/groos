"use client";

import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FieldLabelText, fieldIds } from "./field-label";

type ChoiceFieldProps = {
  formId: string;
  name: string;
  legend: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  options: { value: string; label: string; hint?: string }[];
  defaultValue?: string;
  layout?: "row" | "stack";
  /** Raster van twee kolommen vanaf 640 px bij layout "stack" (onderwerp van contact). */
  gridFromSm?: boolean;
  onValueChange?: (value: string) => void;
};

/**
 * Keuze uit een paar opties als kaarten met native radio's (spec 07 §4.3).
 * Opbouw naar 21st.dev 28339 en 28351, op de RadioCard van spec 02.
 */
export function ChoiceField({
  formId,
  name,
  legend,
  hint,
  error,
  required,
  options,
  defaultValue,
  layout = "row",
  gridFromSm,
  onValueChange,
}: ChoiceFieldProps) {
  const ids = fieldIds(formId, name);
  return (
    <div
      onChange={(e) => {
        const target = e.target as HTMLInputElement;
        if (target.name === name) onValueChange?.(target.value);
      }}
    >
      <RadioGroup
        legend={<FieldLabelText label={legend} required={required} />}
        description={hint}
        error={error}
        errorId={ids.errorId}
        orientation={layout === "row" ? "horizontal" : "vertical"}
        className={cn("min-w-0", gridFromSm && "sm:[&>div]:grid-cols-2")}
      >
        {options.map((o) => (
          <RadioCard
            key={o.value}
            id={`${ids.id}-${o.value}`}
            name={name}
            value={o.value}
            label={o.label}
            description={o.hint}
            defaultChecked={defaultValue === o.value}
            required={required}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
