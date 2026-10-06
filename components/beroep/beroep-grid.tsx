import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { BeroepId } from "@/content/beroepen";
import type { AppPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { bentoSlot, type BentoSlot } from "./bento";

const SPAN: Record<BentoSlot, string> = { wide: "lg:col-span-3", narrow: "lg:col-span-2", full: "lg:col-span-6" };

/**
 * Raster met de beroepen (spec 05 §4.4.2). De hele kaart is één link met
 * de h3 als toegankelijke naam; geen geneste links.
 */
export function BeroepGrid({
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
  items: { id: BeroepId; title: string; body: string; href: AppPath; icon: LucideIcon }[];
  className?: string;
}) {
  return (
    <section id={id} className={cn("section section-rule scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        {/* Bento vanaf lg, net als op de homepage: brede kaarten boven en onder, rijen van drie ertussen. */}
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-6 lg:gap-5">
          {items.map((item, i) => (
            <RevealItem
              key={item.id}
              className={cn("h-full", SPAN[bentoSlot(i, items.length)], items.length % 2 === 1 && "sm:max-lg:last:col-span-2")}
            >
              <Card variant="interactive" className="group h-full">
                <IconTile icon={item.icon} />
                <div className="grid gap-2">
                  <h3 className="text-h3">
                    <Link href={item.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-base text-muted-foreground">{item.body}</p>
                </div>
                <ArrowRight
                  className="mt-auto size-5 text-brand transition-transform duration-150 ease-brand group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
