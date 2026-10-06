import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ROUTES } from "@/lib/routes";
import { LatestVacancies } from "@/components/vacatures/latest-vacancies";
import { VacancyListSkeleton } from "@/components/vacatures/vacancy-list-skeleton";

/**
 * De nieuwste vacatures als eigen sectie op wit (spec 04 §4.3.2).
 * LatestVacancies van spec 06 rendert de h2 met intro, de kaarten of de lege
 * staat, en daaronder de link naar alle vacatures. De visual StaffingFlow
 * staat bij de werkwijze (HowItWorks).
 */
export async function HomeVacancies({ locale }: { locale: Locale }) {
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "home.vacatures" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  return (
    <div id="vacatures">
      <div className="container section">
        <Suspense fallback={<VacancyListSkeleton count={4} variant="compact" />}>
          <LatestVacancies
            locale={locale}
            heading={`${t("title")} ${t("accent")}`}
            headingId="home-vacatures-titel"
            intro={t("intro")}
            limit={4}
            variant="compact"
            viewAll={{ href: ROUTES.vacatures, label: tCommon("cta.viewAllJobs") }}
            emptyText={t("emptyJobseeker")}
            viewAllPosition="below"
          />
        </Suspense>
      </div>
    </div>
  );
}
