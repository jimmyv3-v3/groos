import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import type { FeatureItem } from "./types";

/**
 * Kaartenraster met optioneel icoon (spec 05 §4.4.1). Itemtitels zijn h3; de
 * achtergrond van de sectie zet de pagina met className.
 */
export function ServiceFeatureGrid({
  id,
  heading,
  accent,
  intro,
  features,
  columns = 4,
  className,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  features: FeatureItem[];
  columns?: 3 | 4;
  className?: string;
}) {
  return (
    <section id={id} className={cn("section section-rule scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <RevealGroup
          className={cn(
            "mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:gap-5",
            columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
        >
          {features.map((f) => (
            <RevealItem key={f.title} className="h-full">
              <Card className="h-full">
                {f.icon && <IconTile icon={f.icon} />}
                <div className="grid gap-2">
                  <h3 className="text-h3">{f.title}</h3>
                  <p className="text-base text-muted-foreground">{f.body}</p>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
