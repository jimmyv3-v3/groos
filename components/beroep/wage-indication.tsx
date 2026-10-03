import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

/**
 * Loonindicatie (spec 05 §4.4.2): een Card variant="tint" met badge, één groot
 * bedrag, het voorbehoud direct eronder, en daaronder bron en peildatum. Alle strings komen opgemaakt binnen; dit component formatteert niets.
 */
export function WageIndication({
  id,
  heading,
  accent,
  intro,
  badge,
  rangeLabel,
  range,
  experienced,
  source,
  disclaimer,
  extra,
  className,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  badge: string;
  rangeLabel: string;
  range: string;
  experienced?: { label: string; range: string };
  source: string;
  disclaimer: string;
  extra?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-16">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Reveal>
          <Card variant="tint" className="gap-0 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="brand" size="sm">
                {badge}
              </Badge>
              <p className="text-sm text-muted-foreground">{rangeLabel}</p>
            </div>
            <p className="mt-4 font-display text-h2 font-semibold text-foreground tabular-nums">{range}</p>
            <p className="mt-3 text-base text-foreground">{disclaimer}</p>
            {experienced && (
              <dl className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-border pt-5">
                <dt className="text-base text-muted-foreground">{experienced.label}</dt>
                <dd className="font-display text-h3 font-semibold tabular-nums">{experienced.range}</dd>
              </dl>
            )}
            {extra && <p className="mt-4 text-base text-muted-foreground">{extra}</p>}
          </Card>
          <p className="mt-4 text-sm text-muted-foreground">{source}</p>
        </Reveal>
      </div>
    </section>
  );
}
