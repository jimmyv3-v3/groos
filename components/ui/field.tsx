import * as React from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/**
 * Opbouw van een formulierveld (naar shadcn field). Optionele velden krijgen
 * "(optioneel)" in het label via messages, geen sterretje.
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

function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("mb-2 font-display text-h3 font-semibold text-foreground", className)}
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
