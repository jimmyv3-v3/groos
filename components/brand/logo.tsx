import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";
import paths from "./logo-paths.json";

type LogoProps = {
  /** "wordmark" (standaard) of "lockup" met de beschrijver eronder. */
  variant?: "wordmark" | "lockup";
  /** brand: "gr s" in currentColor en "oo" in kobalt; mono: alles currentColor. */
  tone?: "brand" | "mono";
  /** Hoogte via h-*, de breedte volgt. */
  className?: string;
  title?: string;
  /** true: aria-hidden, voor een logo in een link met eigen aria-label. */
  decorative?: boolean;
};

/**
 * Logo van Groos, concept 3 "Samen" (spec 02 §4.11): het woordmerk "groos"
 * waarin de twee o's één stam delen. Inline SVG; binnen .surface-brand wordt
 * het vanzelf wit, omdat --brand en de tekstkleur daar wit zijn.
 */
export function Logo({
  variant = "wordmark",
  tone = "brand",
  className,
  title = contact.shortName,
  decorative = false,
}: LogoProps) {
  const lockup = variant === "lockup";
  return (
    <svg
      viewBox={lockup ? paths.lockup.viewBox : paths.wordmark.viewBox}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      data-slot="logo"
      className={cn("h-7 w-auto shrink-0 text-foreground", className)}
    >
      <g transform={paths.wordmark.transform}>
        <path className="fill-current" d={paths.wordmark.grs} />
        <path className={tone === "brand" ? "fill-brand" : "fill-current"} d={paths.wordmark.oo} />
      </g>
      {lockup && (
        <g transform={paths.lockup.descriptorTransform}>
          <path
            className={tone === "brand" ? "fill-muted-foreground in-[.surface-brand]:fill-current" : "fill-current"}
            d={paths.lockup.descriptor}
          />
        </g>
      )}
    </svg>
  );
}
