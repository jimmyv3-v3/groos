import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export type ServiceStep = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

/**
 * Numbered "werkwijze" steps with a thin rule, on dark cards.
 * Adapted from the 21st.dev "How It Works" pattern; colours come from the brand tokens.
 */
export function ServiceSteps({
  id,
  heading,
  accent,
  intro,
  steps,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  steps: ServiceStep[];
}) {
  return (
    <section id={id} className="relative scroll-mt-24 py-16 sm:py-20">
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <RevealItem key={s.title} className="h-full">
              <div className="group relative flex h-full flex-col rounded-lg border border-border/70 bg-card/40 p-6 transition-colors duration-500 hover:border-brand/40">
                <div className="flex items-center gap-4">
                  <span className="font-display text-sm font-medium tracking-brand text-brand-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                {s.icon && (
                  <s.icon
                    className="mt-6 h-7 w-7 text-brand"
                    aria-hidden
                  />
                )}
                <h3 className="mt-5 font-display text-h3 font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
