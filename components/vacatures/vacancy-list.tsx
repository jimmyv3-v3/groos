import type { Locale } from "@/i18n/routing";
import type { VacancyListItem } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import type { VacancyCardVariant } from "./types";
import { VacancyCard } from "./vacancy-card";

type Props = {
  items: VacancyListItem[];
  locale: Locale;
  variant?: VacancyCardVariant;
  headingLevel?: "h2" | "h3";
  className?: string;
  ariaLabelledBy?: string;
};

/** Raster van vacaturekaarten (spec 06 §4.7). Leeg: rendert niets; de lege staat is aan de aanroeper. */
export async function VacancyList({
  items,
  locale,
  variant = "default",
  headingLevel = "h3",
  className,
  ariaLabelledBy,
}: Props) {
  if (items.length === 0) return null;
  const now = new Date();
  return (
    <ul role="list" aria-labelledby={ariaLabelledBy} className={cn("grid gap-4 md:grid-cols-2", className)}>
      {items.map((vacancy) => (
        <li key={vacancy.id} className="min-w-0">
          <VacancyCard vacancy={vacancy} locale={locale} variant={variant} headingLevel={headingLevel} now={now} />
        </li>
      ))}
    </ul>
  );
}
