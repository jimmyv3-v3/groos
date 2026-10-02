import type { ReactNode } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

/**
 * Tabel vanaf lg, kaarten eronder (spec 08 §4.3). De eerste kolom levert de
 * link naar het detail; card() levert de kaartinhoud met een h3.
 */
export function ResponsiveList<T>({
  caption,
  columns,
  rows,
  rowKey,
  card,
  empty,
}: {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  rowHref?: (row: T) => string;
  card: (row: T) => ReactNode;
  empty: ReactNode;
}) {
  if (rows.length === 0) return <>{empty}</>;
  return (
    <>
      <ul className="grid gap-3 lg:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="relative rounded-2xl border border-border bg-card p-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring">
            {card(row)}
          </li>
        ))}
      </ul>
      <div className="hidden lg:block">
        <Table>
          <TableCaption className="sr-only">{caption}</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} scope="col" className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((col, i) => (
                  <TableCell key={col.key} className={cn(i === 0 && "font-medium", col.className)}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

/** Hoofdlink van een kaart of eerste tabelcel; in een kaart maakt stretched de hele kaart klikbaar. */
export function rowLinkClass(stretched = false) {
  return cn(
    "font-medium text-foreground underline-offset-4 hover:text-brand-strong hover:underline focus-visible:outline-hidden",
    stretched && "after:absolute after:inset-0 after:rounded-2xl",
  );
}
