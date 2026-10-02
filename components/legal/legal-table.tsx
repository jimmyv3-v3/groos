import { cn } from "@/lib/utils";
import { LegalText } from "@/components/legal/legal-text";

/**
 * Tabelblok in juridische tekst (spec 09 §4.3). Zichtbare caption, kolomkoppen
 * met scope, rijen gescheiden door een lijn, geen zebra. Op smalle schermen
 * scrollt alleen de tabel horizontaal, nooit de pagina.
 */
export function LegalTable({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="overflow-x-auto rounded-xl border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Twee kolommen passen op 390 px; bij meer kolommen scrollt de tabel. */}
      <table className={cn("w-full border-collapse text-left text-sm", head.length > 2 && "min-w-[40rem]")}>
        <caption className="border-b border-border px-4 py-3 text-left text-sm text-muted-foreground">{caption}</caption>
        <thead className="bg-muted">
          <tr className="border-b border-border">
            {head.map((cell) => (
              <th key={cell} scope="col" className="px-4 py-3 align-bottom font-semibold text-foreground">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-foreground">
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
