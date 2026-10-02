import * as React from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type RadioGroupProps = {
  legend: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  errorId?: string;
  orientation?: "vertical" | "horizontal";
  children: React.ReactNode;
  className?: string;
};

/** Groep keuzerondjes als <fieldset> met <legend> (werkt zonder JavaScript). */
function RadioGroup({
  legend,
  description,
  error,
  errorId,
  orientation = "vertical",
  children,
  className,
}: RadioGroupProps) {
  return (
    <fieldset
      data-slot="radio-group"
      aria-invalid={error ? true : undefined}
      aria-describedby={error && errorId ? errorId : undefined}
      className={cn("grid gap-3", className)}
    >
      <legend className="mb-1 text-sm font-medium text-foreground">{legend}</legend>
      {description && <p className="-mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className={cn(orientation === "horizontal" ? "grid grid-cols-2 gap-3" : "grid gap-3")}>
        {children}
      </div>
      {error && (
        <p id={errorId} role="alert" className="flex gap-1.5 text-sm font-medium text-destructive">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}

type RadioCardProps = {
  id: string;
  name: string;
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  defaultChecked?: boolean;
  required?: boolean;
  disabled?: boolean;
};

/** Keuzerondje als kaart; de rand en tint volgen :checked via has-[]. */
function RadioCard({
  id,
  name,
  value,
  label,
  description,
  defaultChecked,
  required,
  disabled,
}: RadioCardProps) {
  return (
    <label
      htmlFor={id}
      data-slot="radio-card"
      className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-input bg-background px-4 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-brand-tint has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        required={required}
        disabled={disabled}
        className="control-radio mt-0.5 focus-visible:outline-hidden"
      />
      <span className="grid gap-0.5">
        <span className="text-base font-medium text-foreground">{label}</span>
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}

export { RadioGroup, RadioCard };
