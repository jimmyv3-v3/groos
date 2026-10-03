import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { OCCUPATION_SLUGS } from "@/lib/data/options";
import { BeheerPagination } from "@/components/beheer/beheer-pagination";
import { EmptyState } from "@/components/beheer/empty-state";
import { FlagBadge } from "@/components/beheer/flag-badge";
import { ListToolbar } from "@/components/beheer/list-toolbar";
import { PageHeader } from "@/components/beheer/page-header";
import { ResponsiveList, rowLinkClass, type Column } from "@/components/beheer/responsive-list";
import { StatusBadge } from "@/components/beheer/status-badge";
import { StatusTabs } from "@/components/beheer/status-tabs";
import { VacancyActions } from "@/components/beheer/vacancy/vacancy-actions";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { listAdminOptions, listOccupationOptions, listVacancies, type VacancyListRow } from "../../_data/vacancies";
import { requireAdmin } from "../../_lib/auth";
import { formatDateNl, formatRelativeNl } from "../../_lib/format";
import { beheerPaths } from "../../_lib/paths";
import { pickTab, VACANCY_TABS, vacancyDisplayStatus } from "../../_lib/status";
import type { VacancyActionTarget, VacancyTab } from "../../_lib/types";
import { listHref, oneOf, pageParam } from "../../_lib/url";
import { firstParam } from "../../_lib/validation/common";
import { S, fill } from "../../_strings";

export const metadata: Metadata = { title: S.vacancies.metaTitle };

const TAB_KEYS: VacancyTab[] = ["online", "gepland", "concepten", "gesloten", "archief", "alle"];

function target(row: VacancyListRow): VacancyActionTarget {
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    city: row.city,
    slug: row.slug,
    status: row.status,
    closesAt: row.closesAt,
    publishAt: row.publishAt,
    isFeatured: row.isFeatured,
    isUrgent: row.isUrgent,
    applicationCount: row.applicationCount,
    publicState: row.publicState,
  };
}

/** Vacaturelijst met tabbladen, filters, zoeken en sortering (spec 08 §4.7). */
export default async function VacanciesPage({ searchParams }: PageProps<"/beheer/vacatures">) {
  const ctx = await requireAdmin();
  const params = await searchParams;
  const tab = pickTab<VacancyTab>(params.tab, VACANCY_TABS, "online");
  const q = firstParam(params.q)?.slice(0, 80);
  const beroep = oneOf(params.beroep, OCCUPATION_SLUGS);
  const vlag = oneOf(params.vlag, ["uitgelicht", "spoed"] as const);
  const sortering = oneOf(params.sortering, ["bewerkt", "sluitdatum", "nummer"] as const) ?? "bewerkt";
  const page = pageParam(params.pagina);

  const [occupations, admins] = await Promise.all([listOccupationOptions(ctx), listAdminOptions(ctx)]);
  const contact = oneOf(params.contact, admins.map((a) => a.id));
  const result = await listVacancies(ctx, { tab, q, beroep, contact, vlag, sortering, page });
  const occupationName = new Map(occupations.map((o) => [o.slug, o.nameNl]));
  const isOwner = ctx.profile.role === "owner";
  const C = S.vacancies.columns;
  const filtered = Boolean(q || beroep || contact || vlag);

  const meta = (row: VacancyListRow) => (
    <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {fill(S.vacancies.number, { nummer: row.number })}
      {row.isFeatured && <FlagBadge flag="featured" />}
      {row.isUrgent && <FlagBadge flag="urgent" />}
    </span>
  );
  const titleCell = (row: VacancyListRow, stretched: boolean) => (
    <div className="grid gap-1">
      <Link href={beheerPaths.vacancy(row.number)} className={rowLinkClass(stretched)}>
        {row.title}
      </Link>
      {meta(row)}
    </div>
  );
  const status = (row: VacancyListRow) => (
    <StatusBadge kind="vacancy" status={vacancyDisplayStatus({ status: row.status, closesAt: row.closesAt, closeReason: row.closeReason })} />
  );
  const columns: Column<VacancyListRow>[] = [
    { key: "title", header: C.title, cell: (r) => titleCell(r, false), className: "min-w-56" },
    { key: "occupation", header: C.occupation, cell: (r) => occupationName.get(r.occupationSlug) ?? r.occupationSlug },
    { key: "city", header: C.city, cell: (r) => r.city ?? S.common.notFilled },
    { key: "status", header: C.status, cell: status },
    { key: "applications", header: C.applications, cell: (r) => r.applicationCount, className: "tabular-nums" },
    { key: "online", header: C.onlineSince, cell: (r) => (r.publishedAt ? formatDateNl(r.publishedAt) : "") },
    { key: "closes", header: C.closes, cell: (r) => (r.closesAt ? formatDateNl(r.closesAt) : "") },
    { key: "contact", header: C.contact, cell: (r) => r.contactName ?? S.common.nobody },
    { key: "updated", header: C.updated, cell: (r) => formatRelativeNl(r.updatedAt) },
    {
      key: "actions",
      header: C.actions,
      cell: (r) => <VacancyActions vacancy={target(r)} isOwner={isOwner} variant="menu" />,
      className: "w-14",
    },
  ];

  const empty = filtered ? (
    <EmptyState
      body={q ? fill(S.empty.search, { zoekterm: q }) : S.empty.vacanciesFiltered}
      action={
        <Link href={listHref(beheerPaths.vacancies, {}, { tab })} className={ctaButtonVariants({ variant: "secondary", size: "sm" })}>
          {S.common.clearFilters}
        </Link>
      }
    />
  ) : tab === "gepland" ? (
    <EmptyState body={S.empty.vacanciesScheduled} />
  ) : (
    <EmptyState
      body={S.empty.vacanciesNone}
      action={
        <Link href={beheerPaths.vacancyNew} className={ctaButtonVariants({ size: "sm" })}>
          <Plus aria-hidden="true" />
          {S.vacancies.newTitle}
        </Link>
      }
    />
  );

  return (
    <>
      <PageHeader
        title={S.vacancies.title}
        actions={
          <Link href={beheerPaths.vacancyNew} className={ctaButtonVariants()}>
            <Plus aria-hidden="true" />
            {S.vacancies.newTitle}
          </Link>
        }
      />
      <StatusTabs
        label={S.vacancies.tabsLabel}
        activeKey={tab}
        tabs={TAB_KEYS.map((key) => ({
          key,
          label: S.vacancies.tabs[key],
          count: result.tabCounts[key],
          href: listHref(beheerPaths.vacancies, params, { tab: key, pagina: null }),
        }))}
      />
      <ListToolbar
        searchLabel={S.vacancies.searchLabel}
        searchPlaceholder={S.vacancies.searchPlaceholder}
        filters={[
          { name: "beroep", label: S.vacancies.filterOccupation, options: occupations.map((o) => ({ value: o.slug, label: o.nameNl })) },
          { name: "contact", label: S.vacancies.filterContact, options: admins.map((a) => ({ value: a.id, label: a.displayName })) },
          {
            name: "vlag",
            label: S.vacancies.filterFlag,
            options: [
              { value: "uitgelicht", label: S.vacancies.flags.featured },
              { value: "spoed", label: S.vacancies.flags.urgent },
            ],
          },
        ]}
        sortOptions={(["bewerkt", "sluitdatum", "nummer"] as const).map((s) => ({ value: s, label: S.vacancies.sort[s] }))}
      />
      <ResponsiveList
        caption={S.vacancies.caption}
        columns={columns}
        rows={result.rows}
        rowKey={(r) => r.id}
        empty={empty}
        card={(r) => (
          <div className="grid gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-1">
                <h3 className="text-[1.0625rem] leading-snug">
                  <Link href={beheerPaths.vacancy(r.number)} className={rowLinkClass(true)}>
                    {r.title}
                  </Link>
                </h3>
                {meta(r)}
              </div>
              <div className="relative z-10 -mt-1 -mr-2">
                <VacancyActions vacancy={target(r)} isOwner={isOwner} variant="menu" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {status(r)}
              {r.city && <span>{r.city}</span>}
              {r.closesAt && <span>{`${C.closes}: ${formatDateNl(r.closesAt)}`}</span>}
              <span>{`${C.applications}: ${r.applicationCount}`}</span>
            </div>
          </div>
        )}
      />
      <BeheerPagination
        page={page}
        pageCount={result.pageCount}
        label={S.common.pagination}
        hrefFor={(p) => listHref(beheerPaths.vacancies, params, { pagina: p })}
      />
    </>
  );
}
