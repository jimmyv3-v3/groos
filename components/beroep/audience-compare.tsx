import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";

export type AudienceColumn = { title: string; href: AppPath; linkLabel: string; current: boolean };

/**
 * Werkzoekende en werkgever naast elkaar (spec 05 §4.4.2). Een echte <table>
 * met zichtbare caption en scopes; de wrapper scrollt horizontaal op 390 px
 * zonder de pagina breder te maken. De huidige kolom krijgt een rustige tint.
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
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Reveal className="mt-10 md:mt-12">
          <div
            role="region"
            aria-label={caption}
            tabIndex={0}
            className="max-w-full overflow-x-auto rounded-2xl border border-border bg-card"
          >
            <table className="w-full min-w-[36rem] border-collapse text-left text-base">
              <caption className="border-b border-border px-5 py-4 text-left text-sm text-muted-foreground">
                {caption}
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <td className="w-[26%] px-5 py-4" />
                  {columns.map((col, i) => (
                    <th key={col.title} scope="col" className={cn("px-5 py-4 font-display text-h3", tint(i))}>
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <th scope="row" className="px-5 py-4 align-top font-semibold text-foreground">
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td key={i} className={cn("px-5 py-4 align-top text-muted-foreground", tint(i))}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td className="px-5 py-3" />
                  {columns.map((col, i) => (
                    <td key={col.title} className={cn("px-5 py-3", tint(i))}>
                      {!col.current && (
                        <Link href={col.href} className="link inline-flex min-h-11 items-center gap-2 font-medium">
                          {col.linkLabel}
                          <ArrowRight className="size-4" aria-hidden="true" />
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
