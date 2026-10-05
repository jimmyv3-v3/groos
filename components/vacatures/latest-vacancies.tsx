import type { ReactNode } from "react";
import { ArrowRight, SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getLatestVacancies, getVacanciesByOccupation } from "@/lib/data/vacancies";
import type { OccupationSlug } from "@/lib/data/options";
import { paths, ROUTES, type AppPath } from "@/lib/routes";
import { CtaButton } from "@/components/ui/cta-button";
import { IconTile } from "@/components/ui/icon-tile";
import { LATEST_DEFAULT_LIMIT } from "./constants";
import type { VacancyCardVariant } from "./types";
import { VacancyList } from "./vacancy-list";
import { occupationPhrase } from "@/i18n/occupation-phrase";

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
  /** Visual rechts van de tekst. De kaarten komen er dan onder. */
  visual?: ReactNode;
  /**
   * "header" (standaard): de link naar alle vacatures staat naast de kop en
   * alleen als er vacatures zijn. "below": de link staat onder de kaarten en
   * ook onder de lege staat (homepage).
   */
  viewAllPosition?: "header" | "below";
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
  visual,
  viewAllPosition = "header",
}: Props) {
  const [items, t, tc, tb] = await Promise.all([
    occupation ? getVacanciesByOccupation(occupation, { limit }).then((r) => r.items) : getLatestVacancies({ limit }),
    getTranslations({ locale, namespace: "vacatures.latest" }),
    getTranslations({ locale, namespace: "common.cta" }),
    getTranslations({ locale, namespace: "beroepen" }),
  ]);

  const defaultHref: AppPath = occupation ? paths.vacaturesVoorBeroep(occupation) : ROUTES.vacatures;
  const defaultLabel = occupation
    ? t("viewOccupation", { occupation: occupationPhrase(tb(`${occupation}.enkelvoud`), locale) })
    : tc("viewAllJobs");

  const below = viewAllPosition === "below";
  const viewAllLink = viewAll !== false && (below || items.length > 0) && (
    <Link
      href={viewAll?.href ?? defaultHref}
      className="link group/link inline-flex min-h-11 shrink-0 items-center gap-1.5 font-medium"
    >
      {viewAll?.label ?? defaultLabel}
      <ArrowRight
        className="size-4 transition-transform duration-150 ease-brand motion-safe:group-hover/link:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
  const empty = visual ? (
    <div className="mt-6 flex flex-col items-start gap-4">
      <p className="max-w-prose text-base text-foreground">{emptyText ?? t("empty")}</p>
      <CtaButton href={ROUTES.inschrijven} variant="secondary">
        {tc("register")}
      </CtaButton>
    </div>
  ) : (
    <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:gap-8 md:p-7">
      <div className="flex gap-4">
        <IconTile icon={SearchX} className="max-sm:hidden" />
        <p className="max-w-prose self-center text-base text-foreground">{emptyText ?? t("empty")}</p>
      </div>
      <CtaButton href={ROUTES.inschrijven} variant="secondary" className="shrink-0 max-md:self-start">
        {tc("register")}
      </CtaButton>
    </div>
  );
  const list = items.length > 0 && (
    <VacancyList items={items} locale={locale} variant={variant} headingLevel="h3" className="mt-8" />
  );

  if (visual) {
    return (
      <section aria-labelledby={headingId}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id={headingId} className="text-h2">
              {heading}
            </h2>
            {intro && <p className="mt-3 text-lead text-muted-foreground">{intro}</p>}
            {viewAllLink && <div className="mt-4">{viewAllLink}</div>}
            {items.length === 0 && empty}
          </div>
          <div className="mx-auto w-full max-w-xl lg:max-w-none">{visual}</div>
        </div>
        {list}
      </section>
    );
  }

  return (
    <section aria-labelledby={headingId}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 id={headingId} className="text-h2">
            {heading}
          </h2>
          {intro && <p className="mt-3 text-lead text-muted-foreground">{intro}</p>}
        </div>
        {!below && viewAllLink}
      </div>
      {list || empty}
      {below && viewAllLink && <p className="mt-6">{viewAllLink}</p>}
    </section>
  );
}
