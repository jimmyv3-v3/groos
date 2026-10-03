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
const buttonVariants = cva(
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
        // min-h-11 houdt ook een tekstknop op 44 px doelgrootte (AC-02-14, spec 02 §12).
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-11 px-4 text-sm lg:h-10",
        default: "h-12 px-5 text-base",
        lg: "h-14 px-7 text-base",
        icon: "size-11",
      },
    },
    // Na de maat, zodat h-auto en px-0 winnen van de maatklassen.
    compoundVariants: [
      { variant: "link", size: ["sm", "default", "lg", "icon"], className: "h-auto min-h-11 w-auto px-0" },
    ],
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type CtaButtonVariantProps = VariantProps<typeof buttonVariants>;

/**
 * Klassen van de knop voor elementen die zelf geen CtaButton zijn (next/link in
 * het beheer, base-ui-triggers). Samengevoegd met tailwind-merge, zodat een
 * className van de aanroeper wint van de maat- en variantklassen.
 */
export function ctaButtonVariants(opts: {
  variant?: CtaButtonVariantProps["variant"];
  size?: CtaButtonVariantProps["size"];
  className?: string;
} = {}): string {
  const { variant, size, className } = opts;
  return cn(buttonVariants({ variant, size }), className);
}

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
  /**
   * Alleen als de naam moet afwijken van het zichtbare label; begint dan met
   * dat label (WCAG 2.5.3, B-54).
   */
  ariaLabel?: string;
  /** target="_blank" rel="noopener noreferrer" (WhatsApp, externe links). */
  external?: boolean;
  /**
   * Met external: verborgen tekst na het label voor schermlezers, zoals
   * common.opensInNewTab (spec 02 §4.7). Staat er ook een ariaLabel, dan komt
   * de tekst ook achter die naam, want aria-label overschrijft de inhoud.
   */
  newTabLabel?: string;
  /** Toont een draaiende LoaderCircle, zet aria-busy en blokkeert de knop. */
  pending?: boolean;
  /** Met pending: statustekst voor schermlezers (common.loading of de verzendtekst). */
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
  newTabLabel,
  pending = false,
  pendingLabel,
}: CtaButtonProps) {
  const classes = ctaButtonVariants({ variant, size, className });
  const blocked = disabled || pending;
  const newTab = external && newTabLabel ? newTabLabel : undefined;
  const content = (
    <>
      {pending && <LoaderCircle className="motion-safe:animate-spin" aria-hidden="true" />}
      {children}
      {newTab && <span className="sr-only"> {newTab}</span>}
      {pending && pendingLabel && (
        <span role="status" className="sr-only">
          {pendingLabel}
        </span>
      )}
    </>
  );

  if (href) {
    const linkProps = {
      className: classes,
      onClick,
      "aria-label": ariaLabel && newTab ? `${ariaLabel} ${newTab}` : ariaLabel,
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
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={pending || undefined}
      data-slot="cta-button"
    >
      {content}
    </button>
  );
}
