import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const FADES = {
  top: "[--deco-at:50%_0%]",
  center: "[--deco-at:50%_50%] [--deco-shape:60%_60%]",
  "top-right": "[--deco-at:100%_0%] [--deco-shape:75%_95%]",
  "top-left": "[--deco-at:0%_0%] [--deco-shape:75%_95%]",
  right: "[--deco-at:100%_50%] [--deco-shape:65%_90%]",
};

type GridPatternProps = {
  /** "grid": fijn ruitjesraster in het border-token; "dots": stippenraster. */
  variant?: "grid" | "dots";
  /** Waar het patroon het sterkst is; het loopt van daaruit radiaal uit. */
  fade?: keyof typeof FADES;
  /** Maat van één ruit of de afstand tussen de stippen, in px. */
  size?: number;
  className?: string;
};

/**
 * Decoratieraster uit dezelfde familie als ColumnLines (.deco in
 * app/globals.css). Server component zonder JavaScript, aria-hidden. De ouder
 * heeft "relative isolate"; het raster ligt achter de inhoud en loopt altijd
 * uit, zodat het nooit een vlak wordt. Hooguit twee of drie per pagina.
 */
function GridPattern({ variant = "grid", fade = "top", size, className }: GridPatternProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="grid-pattern"
      className={cn("deco", variant === "dots" ? "deco-dots" : "deco-grid", FADES[fade], className)}
      style={size ? ({ "--deco-size": `${size}px` } as CSSProperties) : undefined}
    />
  );
}

export { GridPattern };
