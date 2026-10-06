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
  // Kolommen per rij, gelijk aan de rasterklassen hieronder.
  const mdCols = steps.length === 4 ? 2 : 3;
  const lgCols = steps.length === 4 ? 4 : 3;
  return (
    <section id={id} className={cn("section section-rule scroll-mt-24", className)}>
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
              <li key={step.title} className="flex gap-4 md:block">
                {/* Cirkel met het cijfer, op de telefoon bovenaan naast de kop; vanaf md verbindt een haarlijn de stappen. */}
                <div className="flex items-start md:items-center md:gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-border-strong bg-card font-display text-base font-semibold text-brand tabular-nums"
                  >
                    {i + 1}
                  </span>
                  {/* De stap aan het eind van een rij krijgt geen lijn, anders
                      steekt die buiten de pagina en ontstaat horizontale scroll
                      (bij vier stappen staan er op md twee per rij). */}
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "-mr-8 hidden h-px flex-1 bg-border md:block",
                        (i + 1) % mdCols === 0 && "md:max-lg:hidden",
                        (i + 1) % lgCols === 0 && "lg:hidden",
                      )}
                    />
                  )}
                </div>
                <div className="pt-1.5 md:mt-5 md:pt-0">
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
