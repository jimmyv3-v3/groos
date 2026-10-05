import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";

/**
 * Groeipad (spec 05 §4.4.2 en §4.4.4): een <ol> met functienamen, horizontaal
 * vanaf md met een pijl ertussen, verticaal op mobiel.
 */
export function CareerPath({
  id,
  heading,
  accent,
  intro,
  steps,
  listLabel,
  note,
  className,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  steps: string[];
  listLabel: string;
  note?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn("section section-rule scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Reveal>
          <ol aria-label={listLabel} className="mt-10 flex flex-col gap-2 md:mt-12 md:flex-row md:flex-wrap md:items-center md:gap-3">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3 md:contents">
                <span
                  className={cn(
                    "inline-flex min-h-12 items-center rounded-xl border px-4 py-2 font-display font-semibold",
                    i === 0 ? "border-brand bg-brand-tint text-brand-strong" : "border-border bg-card text-foreground",
                  )}
                >
                  {step}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight
                    className="hidden size-5 shrink-0 text-brand-subtle md:block"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </Reveal>
        {note && <p className="mt-8 max-w-[60ch] text-base text-muted-foreground">{note}</p>}
      </div>
    </section>
  );
}
