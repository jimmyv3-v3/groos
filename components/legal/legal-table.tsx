import { cn } from "@/lib/utils";
import { LegalText } from "@/components/legal/legal-text";

/**
 * Tabelblok in juridische tekst (spec 09 §4.3). Zichtbare caption, kolomkoppen
 * met scope, rijen gescheiden door een lijn, geen zebra. Op een telefoon
 * (onder sm) staan de cellen van een rij onder elkaar, met de kolomnaam boven
 * elke waarde; de eerste cel is de kop van het blok. De ARIA-rollen houden de
 * tabelstructuur dan intact voor schermlezers. Vanaf sm is het een gewone
 * tabel; met meer dan twee kolommen scrollt alleen de tabel horizontaal, nooit
 * de pagina.
 */
export function LegalTable({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="overflow-x-auto rounded-xl border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <table
        role="table"
        className={cn("w-full border-collapse text-left text-sm max-sm:block", head.length > 2 && "sm:min-w-[40rem]")}
      >
        <caption className="border-b border-border px-4 py-3 text-left text-sm text-muted-foreground max-sm:block">
          {caption}
        </caption>
        <thead role="rowgroup" className="bg-muted max-sm:sr-only">
          <tr role="row" className="border-b border-border">
            {head.map((cell) => (
              <th
                key={cell}
                role="columnheader"
                scope="col"
                className="px-4 py-3 align-bottom font-semibold text-foreground"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" className="max-sm:block">
          {rows.map((row, i) => (
            <tr key={i} role="row" className="border-b border-border last:border-0 max-sm:block max-sm:px-4 max-sm:py-3">
              {row.map((cell, j) => (
                <td
                  key={j}
                  role="cell"
                  className={cn(
                    "px-4 py-3 align-top text-foreground max-sm:block max-sm:px-0 max-sm:py-1",
                    j === 0 && "max-sm:font-semibold",
                  )}
                >
                  {j > 0 && (
                    <span aria-hidden="true" className="block text-xs font-medium text-muted-foreground sm:hidden">
                      {head[j]}
                    </span>
                  )}
                  <LegalText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
