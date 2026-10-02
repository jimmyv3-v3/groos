import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
import { getVacancyFacets, getVacancyList } from "@/lib/data/vacancies";
import { HOURS_BUCKETS, SHIFTS } from "@/lib/data/options";
import type { VacancyFacets } from "@/lib/data/types";
import {
  buildVacancySearchParams,
  parseVacancySearchParams,
  type VacancySearchState,
} from "@/lib/data/vacancy-search-params";
import { ROUTES } from "@/lib/routes";
import { localizedPath, vacancyListMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { PLACES_VISIBLE, VACANCY_PAGE_SIZE } from "@/components/vacatures/constants";
import { hiddenFieldsFor, vacaturesHref } from "@/components/vacatures/form-params";
import { OccupationIntro } from "@/components/vacatures/occupation-intro";
import type { ActiveFilterChip, FilterGroup } from "@/components/vacatures/types";
import { VacancyActiveFilters } from "@/components/vacatures/vacancy-active-filters";
import { VacancyEmptyState } from "@/components/vacatures/vacancy-empty-state";
import { VacancyFilterSheet } from "@/components/vacatures/vacancy-filter-sheet";
import { VacancyFilters } from "@/components/vacatures/vacancy-filters";
import { displayCity } from "@/components/vacatures/vacancy-format";
import { VacancyList } from "@/components/vacatures/vacancy-list";
import { VacancyNavigationProvider, VacancyResultsRegion } from "@/components/vacatures/vacancy-navigation";
import { VacancyPagination } from "@/components/vacatures/vacancy-pagination";
import { VacancyRegisterPrompt } from "@/components/vacatures/vacancy-register-prompt";
import { VacancySearchForm } from "@/components/vacatures/vacancy-search-form";
import { VacancySort } from "@/components/vacatures/vacancy-sort";

// Dynamisch door searchParams; de data heeft haar eigen vangnet van 3600 s (spec 10, B-35).
// Geen loading.tsx in dit segment: streamen breekt notFound() (spec 06 §4.1).
// Metadata via vacancyListMetadata() uit lib/seo.ts, die pageMetadata() aanroept (spec 12 §4.3).

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/vacatures">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const state = parseVacancySearchParams(await searchParams);
  const t = await getTranslations({ locale, namespace: "vacatures.meta" });
  return vacancyListMetadata({ locale, t: (key, values) => t(key, values), page: state.page, isFiltered: state.isFiltered });
}

type Translator = Awaited<ReturnType<typeof getTranslations<"vacatures">>>;
type BeroepTranslator = Awaited<ReturnType<typeof getTranslations<"beroepen">>>;

/** Filtergroepen als view-model (spec 06 §4.5). */
function buildGroups(state: VacancySearchState, facets: VacancyFacets, locale: Locale, t: Translator, tb: BeroepTranslator): FilterGroup[] {
  const f = state.filters;
  const option = (value: string, label: string, count: number, checked: boolean) => ({
    value,
    label,
    count,
    checked,
    countAria: t("filters.optionCount", { count }),
  });

  // Een aangevinkte plaats zonder open vacatures blijft zichtbaar, zodat hij uit te vinken is.
  const places = [...facets.plaats];
  for (const slug of f.plaats ?? []) if (!places.some((p) => p.slug === slug)) places.push({ slug, name: slug, count: 0 });

  return [
    {
      name: "beroep",
      legend: t("filters.beroep.legend"),
      options: facets.beroep.map((b) => option(b.slug, tb(`${b.slug}.enkelvoud`), b.count, !!f.beroep?.includes(b.slug))),
    },
    {
      name: "plaats",
      legend: t("filters.plaats.legend"),
      options: places.map((p) => option(p.slug, displayCity(p.name, locale), p.count, !!f.plaats?.includes(p.slug))),
      collapseAfter: PLACES_VISIBLE,
      moreLabel: t("filters.plaats.more"),
    },
    {
      name: "uren",
      legend: t("filters.uren.legend"),
      options: HOURS_BUCKETS.map((b) =>
        option(b.id, t(`filters.uren.options.${b.id}`), facets.uren.find((u) => u.id === b.id)?.count ?? 0, !!f.uren?.includes(b.id)),
      ),
    },
    {
      name: "dienst",
      legend: t("filters.dienst.legend"),
      options: SHIFTS.map((s) =>
        option(s.slug, t(`filters.dienst.options.${s.slug}`), facets.dienst.find((d) => d.slug === s.slug)?.count ?? 0, !!f.dienst?.includes(s.slug)),
      ),
    },
  ];
}

/** Eén chip per waarde plus de zoekterm; elke chip linkt naar de staat zonder die waarde (spec 06 §4.5). */
function buildChips(state: VacancySearchState, groups: FilterGroup[], t: Translator): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  const without = (filters: VacancySearchState["filters"]) =>
    vacaturesHref(buildVacancySearchParams({ filters, sort: state.sort }));

  for (const group of groups) {
    const values = (state.filters[group.name] ?? []) as string[];
    for (const value of values) {
      const label = group.options.find((o) => o.value === value)?.label ?? value;
      chips.push({
        key: `${group.name}-${value}`,
        label,
        href: without({ ...state.filters, [group.name]: values.filter((v) => v !== value) }),
        removeLabel: t("filters.removeChip", { label }),
      });
    }
  }
  if (state.filters.q) {
    const label = t("filters.queryChip", { query: state.filters.q });
    chips.push({
      key: "q",
      label,
      href: without({ ...state.filters, q: undefined }),
      removeLabel: t("filters.removeChip", { label }),
    });
  }
  return chips;
}

export default async function VacanciesPage({ params, searchParams }: PageProps<"/[locale]/vacatures">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const state = parseVacancySearchParams(await searchParams);
  const [list, facets] = await Promise.all([
    getVacancyList({ filters: state.filters, sort: state.sort, page: state.page, pageSize: VACANCY_PAGE_SIZE }),
    getVacancyFacets(state.filters),
  ]);
  if (list.outOfRange) notFound(); // vóór elke Suspense-grens (spec 01 §4.13)

  const [t, tb, tn] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures" }),
    getTranslations({ locale, namespace: "beroepen" }),
    getTranslations({ locale, namespace: "header.nav" }),
  ]);

  const action = localizedPath(locale, ROUTES.vacatures);
  const clearHref = ROUTES.vacatures;
  const groups = buildGroups(state, facets, locale, t, tb);
  const chips = buildChips(state, groups, t);
  const activeCount =
    (state.filters.beroep?.length ?? 0) +
    (state.filters.plaats?.length ?? 0) +
    (state.filters.uren?.length ?? 0) +
    (state.filters.dienst?.length ?? 0) +
    (state.filters.q ? 1 : 0);
  const filterHidden = hiddenFieldsFor(state, ["beroep", "plaats", "uren", "dienst"]);
  const resultCount = state.filters.q
    ? t("overview.resultCountQuery", { count: list.total, query: state.filters.q })
    : t("overview.resultCount", { count: list.total });
  const singleOccupation = state.filters.beroep?.length === 1 ? state.filters.beroep[0] : undefined;
  const filterLabels = { heading: t("filters.heading"), apply: t("filters.apply") };

  return (
    <div className="container pt-6 pb-16 sm:pt-8 sm:pb-24">
      <Breadcrumbs items={[{ label: tn("vacatures"), href: ROUTES.vacatures }]} />

      {/* Provider om zoekveld, filters en lijst: allemaal delen ze navigate() en isPending. */}
      <VacancyNavigationProvider>
        <section aria-labelledby="vacatures-titel" className="mt-6 max-w-3xl sm:mt-8">
          <h1 id="vacatures-titel">{t("overview.title")}</h1>
          <p className="mt-4 text-lead text-muted-foreground">{t("overview.intro")}</p>
          <div className="mt-8">
            <VacancySearchForm
              action={action}
              defaultQuery={state.filters.q ?? ""}
              hidden={hiddenFieldsFor(state, ["q"])}
              labels={{
                form: t("search.form"),
                label: t("search.label"),
                placeholder: t("search.placeholder"),
                submit: t("search.submit"),
              }}
            />
          </div>
        </section>

        <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <aside className="hidden lg:col-span-4 lg:block xl:col-span-3">
            <div className="sticky top-24 -mx-2 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain px-2 pb-4">

              <VacancyFilters action={action} groups={groups} hidden={filterHidden} idPrefix="zijbalk" labels={filterLabels} headingLevel="h2" />
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-8 xl:col-span-9">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border pb-4">
              <VacancyFilterSheet
                action={action}
                groups={groups}
                hidden={filterHidden}
                activeCount={activeCount}
                showResultsLabel={t("filters.showResults", { count: list.total })}
                clearHref={clearHref}
                labels={{
                  open: t("filters.open"),
                  openWithCount: t("filters.openWithCount", { count: activeCount }),
                  title: t("filters.sheetTitle"),
                  close: t("filters.close"),
                  clearAll: t("filters.clearAll"),
                  ...filterLabels,
                }}
              />
              <p role="status" aria-live="polite" className="me-auto font-medium tabular-nums text-foreground">
                {resultCount}
              </p>
              <VacancySort
                action={action}
                value={state.sort}
                hidden={hiddenFieldsFor(state, ["sortering"])}
                labels={{
                  label: t("sort.label"),
                  apply: t("sort.apply"),
                  options: { nieuwste: t("sort.options.nieuwste"), salaris: t("sort.options.salaris") },
                }}
              />
            </div>

            <noscript>
              <div className="mt-6 rounded-2xl border border-border p-5 lg:hidden">
                <VacancyFilters action={action} groups={groups} hidden={filterHidden} idPrefix="noscript" labels={filterLabels} headingLevel="h2" />
              </div>
            </noscript>

            <div className="mt-6 grid gap-6">
              <VacancyActiveFilters
                chips={chips}
                clearHref={clearHref}
                labels={{ list: t("filters.activeList"), clearAll: t("filters.clearAll") }}
              />
              {singleOccupation && <OccupationIntro occupation={singleOccupation} locale={locale} />}
              <VacancyResultsRegion labelledBy="vacatures-resultaten" updatingLabel={t("overview.updating")}>
                <h2 id="vacatures-resultaten" className="sr-only">
                  {t("overview.resultsHeading")}
                </h2>
                {list.total > 0 ? (
                  <VacancyList items={list.items} locale={locale} headingLevel="h3" />
                ) : (
                  <VacancyEmptyState
                    variant={state.isFiltered ? "filtered" : "none"}
                    locale={locale}
                    occupation={singleOccupation}
                    clearHref={clearHref}
                  />
                )}
              </VacancyResultsRegion>
              {list.pageCount > 1 && <VacancyPagination state={state} pageCount={list.pageCount} locale={locale} />}
              {list.total > 0 && <VacancyRegisterPrompt locale={locale} headingId="vacatures-inschrijven" />}
            </div>
          </div>
        </div>
      </VacancyNavigationProvider>
    </div>
  );
}
