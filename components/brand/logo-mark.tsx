import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";
import paths from "./logo-paths.json";

type LogoMarkProps = {
  /** "oo": de losse twee o's; "tile": kobalt tegel met uitgespaarde "oo". */
  variant?: "oo" | "tile";
  className?: string;
  title?: string;
  decorative?: boolean;
};

/** Beeldmerk van Groos (spec 02 §4.11). */
export function LogoMark({
  variant = "oo",
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
        <path transform={paths.tile.transform} d={paths.tile.oo} className="fill-background" />
      </svg>
    );
  }
  return (
    <svg
      viewBox={paths.mark.viewBox}
      focusable="false"
      data-slot="logo-mark"
      className={cn("h-12 w-auto shrink-0 text-brand", className)}
      {...a11y}
    >
      <path transform={paths.mark.transform} d={paths.mark.oo} className="fill-current" />
    </svg>
  );
}
