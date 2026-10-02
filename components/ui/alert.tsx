import * as React from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

const TONES: Record<Tone, { classes: string; icon: LucideIcon }> = {
  neutral: { classes: "border-border bg-muted text-foreground", icon: Info },
  info: { classes: "border-info/25 bg-info-tint text-info-strong", icon: Info },
  success: { classes: "border-success/25 bg-success-tint text-success-strong", icon: CircleCheck },
  warning: { classes: "border-warning/25 bg-warning-tint text-warning-strong", icon: TriangleAlert },
  danger: { classes: "border-destructive/25 bg-destructive-tint text-destructive-strong", icon: CircleAlert },
};

type AlertProps = {
  tone?: Tone;
  icon?: LucideIcon | false;
  title?: React.ReactNode;
  /** Element van de titel; "h2" of "h3" als de titel de kop van een sectie is. */
  titleAs?: "p" | "h2" | "h3";
  /** Id van de titel, voor aria-labelledby bij de aanroeper. */
  titleId?: string;
  children?: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<"div">, "title">;

/** Melding in de pagina; de aanroeper zet role="status" of role="alert". */
function Alert({
  tone = "neutral",
  icon,
  title,
  titleAs: Title = "p",
  titleId,
  children,
  className,
  ...props
}: AlertProps) {
  const t = TONES[tone];
  const Icon = icon === false ? null : (icon ?? t.icon);
  return (
    <div
      data-slot="alert"
      className={cn("flex gap-3 rounded-xl border px-4 py-3.5 text-base", t.classes, className)}
      {...props}
    >
      {Icon && <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />}
      <div className="grid gap-1">
        {title && (
          <Title id={titleId} className="font-sans text-base font-semibold tracking-normal text-current">
            {title}
          </Title>
        )}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}

export { Alert };
