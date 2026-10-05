import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";

/** Begrippen en uitleg als <dl> in een kaart met rand, twee kolommen vanaf md (spec 05 §4.4.2). */
export function FactSheet({
  id,
  heading,
  accent,
  intro,
  items,
  className,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  items: { term: string; description: string }[];
  className?: string;
}) {
  return (
    <section id={id} className={cn("section section-rule scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Reveal className="mt-10 md:mt-12">
          <Card className="gap-0 py-2 md:px-8 md:py-3">
            <dl className="grid gap-x-10 md:grid-cols-2">
              {items.map((item) => (
                <div key={item.term} className="border-border py-5 not-first:border-t md:nth-2:border-t-0">
                  <dt className="font-display text-h3 font-semibold text-foreground">{item.term}</dt>
                  <dd className="mt-2 text-base text-muted-foreground">{item.description}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
