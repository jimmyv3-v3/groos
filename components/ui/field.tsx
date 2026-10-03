import * as React from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/**
 * Opbouw van een formulierveld (naar shadcn field). Optionele velden krijgen
 * achter het label forms.common.optionalMark ("(niet verplicht)"), geen sterretje.
 */
function Field({
  invalid,
  className,
  children,
  ...props
}: { invalid?: boolean } & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      data-invalid={invalid || undefined}
      className={cn("grid gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset data-slot="field-set" className={cn("grid gap-4", className)} {...props} />
  );
}

const LEGEND_VARIANTS = {
  /** Gelijk aan Label: de vraag van een groep keuzerondjes of keuzevakjes. */
  label: "text-sm font-medium text-foreground",
  /** Titel van een groep velden in een formulier. */
  group: "mb-2 font-display text-h3 font-semibold text-foreground",
} as const;

function FieldLegend({
  variant = "label",
  className,
  ...props
}: { variant?: keyof typeof LEGEND_VARIANTS } & React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(LEGEND_VARIANTS[variant], className)}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("grid gap-6", className)} {...props} />;
}

function FieldLabel(props: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FieldError({
  id,
  children,
  className,
}: {
  id: string;
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      data-slot="field-error"
      className={cn("flex gap-1.5 text-sm font-medium text-destructive", className)}
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export { Field, FieldSet, FieldLegend, FieldGroup, FieldLabel, FieldDescription, FieldError };
