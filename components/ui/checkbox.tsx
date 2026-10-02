import * as React from "react";
import { cn } from "@/lib/utils";

/** Native keuzevakje (werkt zonder JavaScript, B-36). */
function Checkbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn("control-check", className)}
      {...props}
    />
  );
}

type CheckboxFieldProps = {
  id: string;
  name: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  value?: string;
  defaultChecked?: boolean;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
};

/** Keuzevakje met een klikbaar label van minstens 44 px hoog. */
function CheckboxField({
  id,
  name,
  label,
  description,
  value,
  defaultChecked,
  required,
  invalid,
  describedBy,
  className,
}: CheckboxFieldProps) {
  const descId = description ? `${id}-description` : undefined;
  const describedByIds = [descId, describedBy].filter(Boolean).join(" ") || undefined;
  return (
    <label
      htmlFor={id}
      data-slot="checkbox-field"
      className={cn("flex min-h-11 cursor-pointer items-start gap-3 py-2", className)}
    >
      <Checkbox
        id={id}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedByIds}
        className="mt-0.5"
      />
      <span className="grid gap-0.5">
        <span className="text-base text-foreground">{label}</span>
        {description && (
          <span id={descId} className="text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

export { Checkbox, CheckboxField };
