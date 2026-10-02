import { cn } from "@/lib/utils";
import { brand } from "@/lib/brand";
import { contact } from "@/lib/site";

/**
 * Tijdelijk beeldmerk: initialen in een afgerond vlak, schaalbaar als SVG en in
 * de tekstkleur (currentColor). Eén component, zodat header, footer,
 * testimonial en watermerk dezelfde bron delen.
 *
 * TODO (design): vervang door het echte beeldmerk, bijvoorbeeld een
 * <img src="/brand/logo-mark.svg"> of een inline SVG. Houd de props gelijk.
 * `idSuffix` blijft bestaan voor compatibiliteit met de J. Versseput-aanroepen.
 */
export function Monogram({
  className,
  title = contact.shortName,
}: {
  className?: string;
  idSuffix?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={cn("h-9 w-auto select-none text-brand-strong", className)}
    >
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      />
      <text
        x="50"
        y="53"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="40"
        fontWeight="600"
        fontFamily="inherit"
        fill="currentColor"
      >
        {brand.initials}
      </text>
    </svg>
  );
}
