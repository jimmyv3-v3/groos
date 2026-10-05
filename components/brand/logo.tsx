import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";
import paths from "./logo-paths.json";

type LogoProps = {
  /** "wordmark" (standaard): het beeldmerk als G met "roos" erachter; "lockup": met de beschrijver eronder. */
  variant?: "wordmark" | "lockup";
  /** "horizontal" (standaard): 2 px marge rondom; "stacked": dezelfde opbouw met extra vrije ruimte. */
  layout?: "horizontal" | "stacked";
  /** brand: sikkel in kobalt, de G en de letters in currentColor; mono: alles currentColor. */
  tone?: "brand" | "mono";
  /**
   * true (standaard): de optische versie van het beeldmerk, met bredere
   * tussenruimtes, stompe punten en de rechte randen op het raster van 38 px,
   * voor een beeldmerkhoogte onder ongeveer 48 px. false: het beeldmerk één op
   * één, voor grote toepassingen.
   */
  optical?: boolean;
  /**
   * Zonder className staat het logo op de referentiemaat: beeldmerk 38 px hoog
   * in een kader van 143 bij 43 px (58 px met beschrijver), zodat alle rechte
   * randen op hele pixels vallen. Een andere maat: "h-… w-auto".
   */
  className?: string;
  title?: string;
  /** true: aria-hidden, voor een logo in een link met eigen aria-label. */
  decorative?: boolean;
};

/**
 * Logo van Groos (spec 02 §4.11): het beeldmerk van de klant is de hoofdletter
 * van het woord, dus het logo leest als G + "roos". De letters zijn paden en
 * dragen geen tekst; de toegankelijke naam komt uit aria-label. Inline SVG als
 * blokelement met vaste maten in hele pixels; het kader heeft een marge, zodat
 * geen rand wordt afgesneden. Binnen .surface-brand wordt het vanzelf wit,
 * omdat --brand en de tekstkleur daar wit zijn.
 */
export function Logo({
  variant = "wordmark",
  layout = "horizontal",
  tone = "brand",
  optical = true,
  className,
  title = contact.shortName,
  decorative = false,
}: LogoProps) {
  const lockup = variant === "lockup";
  const box = paths[layout][variant];
  const mark = optical ? paths.markSmall : paths.mark;
  const accent = tone === "brand" ? "fill-brand" : "fill-current";
  return (
    <svg
      viewBox={box.viewBox}
      width={box.width}
      height={box.height}
      overflow="visible"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      shapeRendering="geometricPrecision"
      data-slot="logo"
      className={cn("block shrink-0 text-foreground", className)}
    >
      <path className="fill-current" d={mark.g} />
      <path className={accent} d={mark.crescent} />
      <g transform={optical ? paths.text.optical : paths.text.master}>
        <g transform={paths.wordmark.transform}>
          <path className="fill-current" d={paths.wordmark.roos} />
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
