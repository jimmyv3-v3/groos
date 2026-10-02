import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

/** Certificaten als kaarten met een badge "hoe nodig" (spec 05 §4.4.2 en §4.4.3). */
export function CertificateList({
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
  items: { name: string; needLabel: string; body: string }[];
  className?: string;
}) {
  return (
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <RevealGroup className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 lg:gap-5">
          {items.map((item) => (
            <RevealItem key={item.name} className="h-full">
              <Card className="h-full gap-3">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <h3 className="text-h3">{item.name}</h3>
                  <Badge tone="neutral" size="md">
                    {item.needLabel}
                  </Badge>
                </div>
                <p className="text-base text-muted-foreground">{item.body}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
