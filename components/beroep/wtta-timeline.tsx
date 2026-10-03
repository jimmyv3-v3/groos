import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";

/**
 * Tijdlijn van gedateerde Wtta-mijlpalen (spec 05 §4.4.2). Verleden: gevuld
 * bolletje plus de sr-only zin pastLabel; toekomst: open bolletje.
 */
export function WttaTimeline({
  id,
  heading,
  accent,
  intro,
  items,
  pastLabel,
  className,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  items: { date: string; dateLabel: string; title: string; body: string; past: boolean; source?: string }[];
  pastLabel: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Reveal>
          <ol className="relative mt-10 max-w-3xl md:mt-12">
            {items.map((item, i) => (
              <li key={`${item.date}-${i}`} className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 pb-10 last:pb-0">
                {i < items.length - 1 && (
                  <span className="absolute top-6 bottom-0 left-[0.6875rem] w-px bg-border-strong" aria-hidden="true" />
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative mt-1 size-6 rounded-full border-2 border-brand",
                    item.past ? "bg-brand" : "bg-background",
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-brand-strong">
                    <time dateTime={item.date}>{item.dateLabel}</time>
                    {item.past && <span className="sr-only"> {pastLabel}</span>}
                  </p>
                  <h3 className="mt-1 text-h3">{item.title}</h3>
                  <p className="mt-2 text-base text-muted-foreground">{item.body}</p>
                  {item.source && <p className="mt-2 text-sm text-muted-foreground">{item.source}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
