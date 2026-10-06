import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";

export type AudienceColumn = { title: string; href: AppPath; linkLabel: string; current: boolean };

/**
 * Werkzoekende en werkgever naast elkaar (spec 05 §4.4.2). Een echte <table>
 * met zichtbare caption en scopes. Vanaf md staan de kolommen naast elkaar.
 * Daaronder passen drie kolommen niet op een telefoon: de cellen staan dan per
 * rij onder elkaar, met de kolomnaam boven elke waarde, zodat niemand opzij
 * hoeft te scrollen. De ARIA-rollen houden de tabelstructuur voor schermlezers
 * intact als de cellen als blok worden getoond. De huidige kolom krijgt een
 * rustige tint.
 */
export function AudienceCompare({
  id,
  heading,
  accent,
  intro,
  caption,
  columns,
  rows,
  className,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  caption: string;
  columns: [AudienceColumn, AudienceColumn];
  rows: { label: string; values: [string, string] }[];
  className?: string;
}) {
  const tint = (i: number) => (columns[i]?.current ? "bg-brand-tint" : undefined);
  return (
    <section id={id} className={cn("section section-rule scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Reveal className="mt-10 md:mt-12">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table role="table" className="w-full border-collapse text-left text-base max-md:block">
              <caption className="border-b border-border px-5 py-4 text-left text-sm text-muted-foreground max-md:block">
                {caption}
              </caption>
              <thead role="rowgroup" className="max-md:sr-only">
                <tr role="row" className="border-b border-border">
                  <td role="cell" className="w-[26%] px-5 py-4" />
                  {columns.map((col, i) => (
                    <th
                      key={col.title}
                      role="columnheader"
                      scope="col"
                      className={cn("px-5 py-4 font-display text-h3", tint(i))}
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody role="rowgroup" className="max-md:block">
                {rows.map((row) => (
                  <tr key={row.label} role="row" className="border-b border-border max-md:block md:last:border-0">
                    <th
                      role="rowheader"
                      scope="row"
                      className="px-5 py-4 align-top font-semibold text-foreground max-md:block max-md:pb-2 max-md:font-display max-md:text-h3"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td
                        key={i}
                        role="cell"
                        className={cn("px-5 py-4 align-top text-muted-foreground max-md:block max-md:py-3", tint(i))}
                      >
                        {/* Op de telefoon staat de kolomkop verborgen; de naam staat dan boven de waarde. */}
                        <span aria-hidden="true" className="block text-sm font-medium text-brand-strong md:hidden">
                          {columns[i]?.title}
                        </span>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot role="rowgroup" className="max-md:block">
                <tr role="row" className="max-md:block md:border-t md:border-border">
                  <td role="cell" className="px-5 py-3 max-md:hidden" />
                  {columns.map((col, i) => (
                    <td
                      key={col.title}
                      role="cell"
                      className={cn("px-5 py-3", col.current ? "max-md:hidden" : "max-md:block", tint(i))}
                    >
                      {!col.current && (
                        <Link href={col.href} className="link inline-block py-2.5 font-medium">
                          {col.linkLabel}
                          {" "}
                          <ArrowRight className="inline size-4 align-[-0.125em]" aria-hidden="true" />
                        </Link>
                      )}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
