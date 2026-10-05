import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ColumnLinesProps = {
  /** Breedte van één kolom in px. */
  columnWidth?: number;
  /** Aantal kolommen; het veld staat gecentreerd en is columnWidth maal columnCount breed. */
  columnCount?: number;
  /** Tot dit percentage van de straal zijn de lijnen volledig zichtbaar. */
  radialFadeStart?: number;
  /** Vanaf dit percentage van de straal zijn de lijnen weg. */
  radialFadeEnd?: number;
  className?: string;
  children?: ReactNode;
};

/**
 * Veld van dunne verticale kolomlijnen achter de inhoud, radiaal uitlopend
 * naar de randen (naar 21st.dev "Download Section with Column Lines", id 29768;
 * zie docs/21st-keuzes.md). Server component, alleen CSS: de lijnen zijn een
 * repeating-linear-gradient in het border-token en de uitloop is een
 * mask-image (.column-lines in app/globals.css). Het veld is decoratie
 * (aria-hidden) en ligt achter de kinderen; binnen .surface-brand wordt het
 * vanzelf wit. Het middelpunt van de uitloop schuift met de CSS-variabele
 * --cl-at in className, bijvoorbeeld "[--cl-at:100%_0%]".
 */
function ColumnLines({
  columnWidth = 80,
  columnCount = 14,
  radialFadeStart = 30,
  radialFadeEnd = 70,
  className,
  children,
}: ColumnLinesProps) {
  const style = {
    "--cl-width": `${columnWidth}px`,
    "--cl-count": columnCount,
    "--cl-fade-start": `${radialFadeStart}%`,
    "--cl-fade-end": `${radialFadeEnd}%`,
  } as CSSProperties;
  return (
    <div data-slot="column-lines" className={cn("column-lines", className)}>
      <div aria-hidden="true" className="column-lines-field" style={style} />
      {children}
    </div>
  );
}

export { ColumnLines };
export type { ColumnLinesProps };
