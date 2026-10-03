import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import type { FaqItem } from "./types";

/**
 * Veelgestelde vragen (spec 05 §4.4.1). Server component op de native
 * <details>-accordion van spec 02: werkt met Enter en Spatie zonder JavaScript,
 * met dezelfde name gaat steeds één antwoord open. De pagina zet de FAQPage
 * JSON-LD met exact dezelfde items.
 */
export function ServiceFaq({
  id = "faq",
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
  items: FaqItem[];
  className?: string;
}) {
  return (
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Accordion>
          {items.map((item, i) => (
            <AccordionItem key={item.q} name={id} title={item.q} defaultOpen={i === 0}>
              <p>{item.a}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
