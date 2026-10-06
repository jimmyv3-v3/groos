import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";
import paths from "./logo-paths.json";

type LogoMarkProps = {
  /** "mark": het losse beeldmerk; "tile": kobalt tegel met het beeldmerk in wit. */
  variant?: "mark" | "tile";
  /** Alleen bij "mark". brand: G in currentColor, sikkel in kobalt; mono: alles currentColor. */
  tone?: "brand" | "mono";
  /**
   * true (standaard): de optische versie met bredere tussenruimtes, stompe
   * punten en de rechte randen op het raster, voor een beeldmerkhoogte onder
   * ongeveer 48 px. false: het beeldmerk één op één, voor grote toepassingen.
   */
  optical?: boolean;
  /**
   * Zonder className de referentiemaat: de tegel 64 px (beeldmerk 34 bij 38 px,
   * 59 procent van de hoogte, op hele pixels), het losse beeldmerk 39 bij 43 px.
   * Scherp op 1x zijn de tegelmaten 64 en 32 px. Een andere maat: "size-…" of
   * "h-… w-auto".
   */
  className?: string;
  title?: string;
  decorative?: boolean;
};

/** Beeldmerk van Groos: de G in drie delen met de sikkel (spec 02 §4.11). */
export function LogoMark({
  variant = "mark",
  tone = "brand",
  optical = true,
  className,
  title = contact.shortName,
  decorative = false,
}: LogoMarkProps) {
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": title };
  const mark = optical ? paths.markSmall : paths.mark;
  if (variant === "tile") {
    const { size, rx } = paths.tile;
    return (
      <svg
        viewBox={paths.tile.viewBox}
        width={size}
        height={size}
        focusable="false"
        shapeRendering="geometricPrecision"
        data-slot="logo-mark"
        className={cn("block shrink-0 text-brand", className)}
        {...a11y}
      >
        <rect width={size} height={size} rx={rx} className="fill-current" />
        <g transform={paths.tile.mark} className="fill-background">
          <path d={mark.g} />
          <path d={mark.crescent} />
        </g>
      </svg>
    );
  }
  return (
    <svg
      viewBox={paths.mark.viewBox}
      width={paths.mark.width}
      height={paths.mark.height}
      overflow="visible"
      focusable="false"
      shapeRendering="geometricPrecision"
      data-slot="logo-mark"
      className={cn("block shrink-0 text-foreground", className)}
      {...a11y}
    >
      <path d={mark.g} className="fill-current" />
      <path d={mark.crescent} className={tone === "brand" ? "fill-brand" : "fill-current"} />
    </svg>
  );
}
