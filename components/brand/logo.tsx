import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";
import paths from "./logo-paths.json";

type LogoProps = {
  /** "wordmark" (standaard): beeldmerk met "groos"; "lockup": met de beschrijver eronder. */
  variant?: "wordmark" | "lockup";
  /** "horizontal" (standaard): beeldmerk links; "stacked": beeldmerk boven het woordmerk. */
  layout?: "horizontal" | "stacked";
  /** brand: sikkel en "oo" in kobalt, de rest in currentColor; mono: alles currentColor. */
  tone?: "brand" | "mono";
  /** Hoogte via h-*, de breedte volgt. */
  className?: string;
  title?: string;
  /** true: aria-hidden, voor een logo in een link met eigen aria-label. */
  decorative?: boolean;
};

/**
 * Logo van Groos (spec 02 §4.11): het beeldmerk van de klant, een G in drie
 * delen met een sikkel links, naast of boven het woordmerk "groos". Inline
 * SVG; binnen .surface-brand wordt het vanzelf wit, omdat --brand en de
 * tekstkleur daar wit zijn.
 */
export function Logo({
  variant = "wordmark",
  layout = "horizontal",
  tone = "brand",
  className,
  title = contact.shortName,
  decorative = false,
}: LogoProps) {
  const lockup = variant === "lockup";
  const box = paths[layout][variant];
  const accent = tone === "brand" ? "fill-brand" : "fill-current";
  return (
    <svg
      viewBox={box.viewBox}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      data-slot="logo"
      className={cn("h-7 w-auto shrink-0 text-foreground", className)}
    >
      <g transform={box.mark}>
        <path className="fill-current" d={paths.mark.g} />
        <path className={accent} d={paths.mark.crescent} />
      </g>
      <g transform={box.text}>
        <g transform={paths.wordmark.transform}>
          <path className="fill-current" d={paths.wordmark.grs} />
          <path className={accent} d={paths.wordmark.oo} />
        </g>
        {lockup && (
          <g transform={paths.descriptor.transform}>
            <path
              className={tone === "brand" ? "fill-muted-foreground in-[.surface-brand]:fill-current" : "fill-current"}
              d={paths.descriptor.d}
            />
          </g>
        )}
      </g>
    </svg>
  );
}
