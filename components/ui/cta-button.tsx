import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * De knop van de site (spec 02 §4.7). Eén component voor alle knoppen en
 * knoplinks: "/…" wordt een locale-bewuste Link, andere href's een <a> en
 * zonder href een <button>. Elk element krijgt data-slot="cta-button".
 * Binnen .surface-brand wordt primary vanzelf wit met kobalt tekst.
 */
export const ctaButtonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[background-color,border-color,color,box-shadow] duration-150 ease-brand motion-safe:active:translate-y-px [&_svg]:size-[1.125rem] [&_svg]:shrink-0 aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-xs hover:bg-brand-strong",
        secondary:
          "border border-border-strong bg-background text-foreground hover:border-brand hover:text-brand-strong",
        tint: "bg-brand-tint text-brand-strong hover:bg-brand/15",
        ghost: "text-foreground hover:bg-muted hover:text-brand-strong",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-strong",
        link: "h-auto min-h-11 px-0 text-brand underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-11 px-4 text-sm lg:h-10",
        default: "h-12 px-5 text-base",
        lg: "h-14 px-7 text-base",
        icon: "size-11",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto min-h-11 px-0" }],
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type CtaButtonVariantProps = VariantProps<typeof ctaButtonVariants>;

export interface CtaButtonProps {
  children: ReactNode;
  /** "/…" wordt Link uit @/i18n/navigation, anders <a>; zonder href een <button>. */
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: NonNullable<CtaButtonVariantProps["size"]>;
  variant?: NonNullable<CtaButtonVariantProps["variant"]>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
  /** target="_blank" rel="noopener noreferrer" (WhatsApp, externe links). */
  external?: boolean;
  /** Toont een draaiende LoaderCircle, zet aria-busy en blokkeert de knop. */
  pending?: boolean;
  /** Toegankelijke naam van de spinner (common.a11y.loading). */
  pendingLabel?: string;
}

export function CtaButton({
  children,
  href,
  onClick,
  className,
  size = "default",
  variant = "primary",
  type = "button",
  disabled = false,
  ariaLabel,
  external = false,
  pending = false,
  pendingLabel,
}: CtaButtonProps) {
  const classes = ctaButtonVariants({ variant, size, className });
  const blocked = disabled || pending;
  const content = (
    <>
      {pending && (
        <LoaderCircle
          className="animate-spin"
          aria-hidden={pendingLabel ? undefined : true}
          aria-label={pendingLabel}
          role={pendingLabel ? "img" : undefined}
        />
      )}
      {children}
    </>
  );

  if (href) {
    const linkProps = {
      className: classes,
      onClick,
      "aria-label": ariaLabel,
      "aria-disabled": blocked || undefined,
      "aria-busy": pending || undefined,
      tabIndex: blocked ? -1 : undefined,
      "data-slot": "cta-button",
      ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    };
    if (href.startsWith("/") && !external) {
      return (
        <Link href={href} {...linkProps}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} {...linkProps}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={blocked}
      className={cn(classes)}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={pending || undefined}
      data-slot="cta-button"
    >
      {content}
    </button>
  );
}
