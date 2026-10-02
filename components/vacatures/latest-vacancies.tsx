import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getLatestVacancies, getVacanciesByOccupation } from "@/lib/data/vacancies";
import type { OccupationSlug } from "@/lib/data/options";
import { paths, ROUTES, type AppPath } from "@/lib/routes";
import { CtaButton } from "@/components/ui/cta-button";
import { LATEST_DEFAULT_LIMIT } from "./constants";
import type { VacancyCardVariant } from "./types";
import { lowerFirst } from "./vacancy-format";
import { VacancyList } from "./vacancy-list";

type Props = {
  locale: Locale;
  heading: string;
  headingId: string;
  intro?: string;
  occupation?: OccupationSlug;
  limit?: number;
  variant?: VacancyCardVariant;
  viewAll?: { href: AppPath; label: string } | false;
  emptyText?: string;
};

/**
 * Nieuwste vacatures voor homepage en beroepspagina's (spec 06 §4.8). De
 * aanroeper zet dit in een Suspense met VacancyListSkeleton en in een container.
 */
export async function LatestVacancies({
  locale,
  heading,
  headingId,
  intro,
  occupation,
  limit = LATEST_DEFAULT_LIMIT,
  variant,
  viewAll,
  emptyText,
}: Props) {
  const [items, t, tc, tb] = await Promise.all([
    occupation ? getVacanciesByOccupation(occupation, { limit }).then((r) => r.items) : getLatestVacancies({ limit }),
    getTranslations({ locale, namespace: "vacatures.latest" }),
    getTranslations({ locale, namespace: "common.cta" }),
    getTranslations({ locale, namespace: "beroepen" }),
  ]);

  const defaultHref: AppPath = occupation ? paths.vacaturesVoorBeroep(occupation) : ROUTES.vacatures;
  const defaultLabel = occupation
    ? t("viewOccupation", { occupation: lowerFirst(tb(`${occupation}.enkelvoud`), locale) })
    : tc("viewAllJobs");

  return (
    <section aria-labelledby={headingId}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 id={headingId} className="text-h2">
            {heading}
          </h2>
          {intro && <p className="mt-3 text-lead text-muted-foreground">{intro}</p>}
        </div>
        {viewAll !== false && items.length > 0 && (
          <Link
            href={viewAll?.href ?? defaultHref}
            className="link inline-flex min-h-11 shrink-0 items-center gap-1.5 font-medium"
          >
            {viewAll?.label ?? defaultLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      {items.length > 0 ? (
        <VacancyList items={items} locale={locale} variant={variant} headingLevel="h3" className="mt-8" />
      ) : (
        <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-muted p-6">
          <p className="max-w-prose text-base text-foreground">{emptyText ?? t("empty")}</p>
          <CtaButton href={ROUTES.inschrijven} variant="secondary">
            {tc("register")}
          </CtaButton>
        </div>
      )}
    </section>
  );
}
