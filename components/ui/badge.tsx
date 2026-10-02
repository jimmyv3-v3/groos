import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "bg-neutral-tint text-muted-foreground",
        brand: "bg-brand-tint text-brand-strong",
        info: "bg-info-tint text-info-strong",
        success: "bg-success-tint text-success-strong",
        warning: "bg-warning-tint text-warning-strong",
        danger: "bg-destructive-tint text-destructive-strong",
      },
      size: {
        sm: "h-6 px-2.5 text-xs",
        md: "h-7 px-3 text-sm",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm" },
  },
);

export type BadgeTone = "neutral" | "brand" | "info" | "success" | "warning" | "danger";

type BadgeProps = {
  tone?: BadgeTone;
  size?: "sm" | "md";
  /** @deprecated Elke badge heeft altijd een stip (spec 02 §4.7); de prop doet niets meer. */
  dot?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<"span">, "children">;

/** Statuslabel met een stip vóór de tekst; altijd met tekst, kleur is nooit de enige drager. */
function Badge({ tone, size, dot, icon: Icon, children, className, ...props }: BadgeProps) {
  void dot; // niet doorgeven aan de <span>
  return (
    <span data-slot="badge" className={cn(badgeVariants({ tone, size }), className)} {...props}>
      <span data-slot="badge-dot" className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
