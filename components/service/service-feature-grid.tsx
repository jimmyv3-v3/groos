import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export type ServiceFeature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

/** "Waarom kiezen voor"-raster met iconen op een detailpagina. */
export function ServiceFeatureGrid({
  id,
  heading,
  accent,
  intro,
  features,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  features: ServiceFeature[];
}) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 border-y border-border/60 bg-card/20 py-16 sm:py-20"
    >
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <RevealGroup className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <RevealItem key={f.title}>
              <f.icon
                className="h-6 w-6 text-brand"
                strokeWidth={1.4}
                aria-hidden
              />
              <h3 className="mt-4 font-display text-base font-medium text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
