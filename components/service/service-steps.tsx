import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import type { StepItem } from "./types";

/**
 * Genummerde stappen als <ol> (spec 05 §4.4.1). Het cijfer staat los naast de
 * kop en is aria-hidden; de lijst zelf geeft de volgorde aan schermlezers.
 * Geen "Stap 1"-label (spec 03 §6.5 regel 7).
 */
export function ServiceSteps({
  id,
  heading,
  accent,
  intro,
  steps,
  className,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  steps: StepItem[];
  className?: string;
}) {
  return (
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Reveal>
          <ol
            className={cn(
              "mt-10 grid gap-x-8 gap-y-8 md:mt-12",
              steps.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3",
            )}
          >
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4 border-t border-border-strong pt-5 md:block">
                <span
                  aria-hidden="true"
                  className="font-display text-h2 leading-none font-semibold text-brand tabular-nums md:block"
                >
                  {i + 1}
                </span>
                <div className="md:mt-4">
                  <h3 className="text-h3">{step.title}</h3>
                  <p className="mt-2 text-base text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
