import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildVacancySearchParams, type VacancySearchState } from "@/lib/data/vacancy-search-params";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationStatus,
} from "@/components/ui/pagination";
import { vacaturesHref } from "./form-params";

type Props = { state: VacancySearchState; pageCount: number; locale: Locale };

/** Pagina 1, de buren van de huidige pagina en de laatste; daartussen een beletselteken. */
function pageWindow(current: number, count: number): (number | "gap")[] {
  const pages = new Set([1, count, current - 1, current, current + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

/** Paginering met gewone links ?pagina=n (spec 06 §4.2, B-16). */
export async function VacancyPagination({ state, pageCount, locale }: Props) {
  if (pageCount <= 1) return null;
  const [t, to] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.pagination" }),
    getTranslations({ locale, namespace: "vacatures.overview" }),
  ]);
  const href = (page: number) => vacaturesHref(buildVacancySearchParams({ ...state, page }));
  const current = Math.min(state.page, pageCount);

  return (
    <Pagination label={t("label")}>
      <PaginationContent>
        <PaginationPrevious href={current > 1 ? href(current - 1) : undefined} label={t("previous")} />
        {pageWindow(current, pageCount).map((p, i) =>
          p === "gap" ? (
            <PaginationEllipsis key={`gap-${i}`} label="" />
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href={href(p)} isActive={p === current}>
                <span className="sr-only">{t("page", { page: p })}</span>
                <span aria-hidden="true">{p}</span>
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationStatus>{to("pageStatus", { page: current, pageCount })}</PaginationStatus>
        <PaginationNext href={current < pageCount ? href(current + 1) : undefined} label={t("next")} />
      </PaginationContent>
    </Pagination>
  );
}
