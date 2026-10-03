import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";
import paths from "./logo-paths.json";

type LogoMarkProps = {
  /** "mark": het losse beeldmerk; "tile": kobalt tegel met het beeldmerk in wit. */
  variant?: "mark" | "tile";
  /** Alleen bij "mark". brand: G in currentColor, sikkel in kobalt; mono: alles currentColor. */
  tone?: "brand" | "mono";
  className?: string;
  title?: string;
  decorative?: boolean;
};

/** Beeldmerk van Groos: de G in drie delen met de sikkel (spec 02 §4.11). */
export function LogoMark({
  variant = "mark",
  tone = "brand",
  className,
  title = contact.shortName,
  decorative = false,
}: LogoMarkProps) {
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": title };
  if (variant === "tile") {
    return (
      <svg
        viewBox={paths.tile.viewBox}
        focusable="false"
        data-slot="logo-mark"
        className={cn("size-12 shrink-0 text-brand", className)}
        {...a11y}
      >
        <rect width="48" height="48" rx={paths.tile.rx} className="fill-current" />
        <g transform={paths.tile.mark} className="fill-background">
          <path d={paths.mark.g} />
          <path d={paths.mark.crescent} />
        </g>
      </svg>
    );
  }
  return (
    <svg
      viewBox={paths.mark.viewBox}
      focusable="false"
      data-slot="logo-mark"
      className={cn("h-12 w-auto shrink-0 text-foreground", className)}
      {...a11y}
    >
      <path d={paths.mark.g} className="fill-current" />
      <path d={paths.mark.crescent} className={tone === "brand" ? "fill-brand" : "fill-current"} />
    </svg>
  );
}
