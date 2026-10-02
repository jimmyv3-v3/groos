import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";

/** Begrippen en uitleg als <dl> in twee kolommen vanaf md (spec 05 §4.4.2). */
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
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Reveal>
          <dl className="mt-10 grid gap-x-10 border-t border-border md:mt-12 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.term} className="border-b border-border py-5">
                <dt className="font-display text-h3 font-semibold text-foreground">{item.term}</dt>
                <dd className="mt-2 text-base text-muted-foreground">{item.description}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
