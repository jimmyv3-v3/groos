// STUB: wordt vervangen door spec 06
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { VacancyListItem } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type VacancyCardVariant = "default" | "compact";

/** Tijdelijke lijst met kaarten (titel en plaats) tot spec 06 VacancyList en VacancyCard levert. */
export async function VacancyList({
  items,
  headingLevel = "h3",
  className,
  ariaLabelledBy,
}: {
  items: VacancyListItem[];
  locale: Locale;
  variant?: VacancyCardVariant;
  headingLevel?: "h2" | "h3";
  className?: string;
  ariaLabelledBy?: string;
}) {
  if (items.length === 0) return null;
  const Heading = headingLevel;
  return (
    <ul role="list" aria-labelledby={ariaLabelledBy} className={cn("grid gap-4 md:grid-cols-2", className)}>
      {items.map((vacancy) => (
        <li key={vacancy.id}>
          <Card variant="interactive" className="h-full p-5">
            <Heading className="text-h3">
              <Link href={vacancy.path} className="after:absolute after:inset-0">
                {vacancy.title}
              </Link>
            </Heading>
            <p className="text-sm text-muted-foreground">{vacancy.city}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
