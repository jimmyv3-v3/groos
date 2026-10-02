import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * De merk-CTA van de site. Eén component voor alle offerte- en belknoppen, zodat
 * de nieuwe identiteit op één plek wordt bepaald. Dit is het "signature"-element
 * dat bij de re-skin vervangen of opgewaardeerd wordt (bijvoorbeeld met een
 * 21st.dev-component), zolang de props hetzelfde blijven.
 *
 * Rendert een locale-bewuste <Link> voor interne paden ("/..."), een gewone <a>
 * voor ankers en externe links (#offerte, tel:, mailto:) en anders een <button>.
 */

const SIZES = {
  sm: "h-9 px-5 text-sm",
  default: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-[0.95rem]",
} as const;

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
  secondary:
    "border border-border bg-background/60 text-foreground hover:border-brand/60 hover:bg-card",
} as const;

interface CtaButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: keyof typeof SIZES;
  variant?: keyof typeof VARIANTS;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
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
}: CtaButtonProps) {
  const classes = cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(classes, disabled && "pointer-events-none opacity-60")}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
