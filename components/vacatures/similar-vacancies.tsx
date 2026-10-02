import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getSimilarVacancies } from "@/lib/data/vacancies";
import { ROUTES } from "@/lib/routes";
import { SIMILAR_LIMIT } from "./constants";
import { VacancyList } from "./vacancy-list";

type Props = { number: number; locale: Locale; headingId: string };

/** Vergelijkbare vacatures (spec 06 §4.10); zonder resultaten niets. */
export async function SimilarVacancies({ number, locale, headingId }: Props) {
  const [items, t, tc] = await Promise.all([
    getSimilarVacancies(number, { limit: SIMILAR_LIMIT, fill: true }),
    getTranslations({ locale, namespace: "vacatures.detail.similar" }),
    getTranslations({ locale, namespace: "common.cta" }),
  ]);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={headingId}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id={headingId} className="text-h2">
          {t("title")}
        </h2>
        <Link href={ROUTES.vacatures} className="link inline-flex min-h-11 items-center gap-1.5 font-medium">
          {tc("viewAllJobs")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <VacancyList items={items} locale={locale} variant="compact" headingLevel="h3" className="mt-6 lg:grid-cols-3" />
    </section>
  );
}
