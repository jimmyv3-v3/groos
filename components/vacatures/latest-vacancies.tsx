// STUB: wordt vervangen door spec 06
import { ArrowRight, Clock, Euro, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getLatestVacancies } from "@/lib/data/vacancies";
import type { OccupationSlug } from "@/lib/data/options";
import { formatEuro } from "@/lib/format";
import { ROUTES, paths, type AppPath } from "@/lib/routes";
import { Card } from "@/components/ui/card";
import { CtaButton } from "@/components/ui/cta-button";

type VacancyCardVariant = "default" | "compact";

export type LatestVacanciesProps = {
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
 * Tijdelijke versie van LatestVacancies (spec 06 §4.8) met dezelfde props en
 * dezelfde opbouw: sectie met h2, intro, lijst van kaarten en een link naar
 * alle vacatures; zonder vacatures een zin en de knop "Schrijf je in".
 */
export async function LatestVacancies({
  locale,
  heading,
  headingId,
  intro,
  occupation,
  limit = 3,
  viewAll,
  emptyText,
}: LatestVacanciesProps) {
  const [tCommon, items] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getLatestVacancies({ limit, occupation }),
  ]);
  const href = viewAll ? viewAll.href : occupation ? paths.vacaturesVoorBeroep(occupation) : ROUTES.vacatures;
  const label = viewAll ? viewAll.label : tCommon("cta.viewAllJobs");

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="max-w-3xl text-h2">
        {heading}
      </h2>
      {intro && <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">{intro}</p>}
      {items.length > 0 ? (
        <>
          <ul role="list" className="mt-8 grid gap-4 md:grid-cols-2">
            {items.map((v) => (
              <li key={v.id}>
                <Card variant="interactive" className="h-full gap-3 p-5 md:p-5">
                  <h3 className="font-display text-h3 font-semibold">
                    <Link
                      href={v.path}
                      className="after:absolute after:inset-0"
                      lang={locale === "en" ? "nl" : undefined}
                    >
                      {v.title}
                    </Link>
                  </h3>
                  <ul role="list" className="grid gap-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <MapPin aria-hidden className="size-4 text-brand" />
                      {v.city}
                    </li>
                    <li className="flex items-center gap-2">
                      <Euro aria-hidden className="size-4 text-brand" />
                      {tCommon("format.wageRange", {
                        min: formatEuro(v.salaryMin, locale),
                        max: formatEuro(v.salaryMax, locale),
                      })}
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock aria-hidden className="size-4 text-brand" />
                      {tCommon("format.hoursRange", { min: v.hoursMin, max: v.hoursMax })}
                    </li>
                  </ul>
                </Card>
              </li>
            ))}
          </ul>
          {viewAll !== false && (
            <Link href={href} className="link mt-6 inline-flex min-h-11 items-center gap-2 font-medium">
              {label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          )}
        </>
      ) : (
        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:p-7">
          <p className="max-w-[60ch] text-base">{emptyText}</p>
          <CtaButton href={ROUTES.inschrijven} variant="secondary" className="w-full shrink-0 sm:w-auto">
            {tCommon("cta.register")}
          </CtaButton>
        </div>
      )}
    </section>
  );
}
