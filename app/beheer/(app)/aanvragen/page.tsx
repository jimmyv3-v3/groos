import type { Metadata } from "next";
import Link from "next/link";
import { OCCUPATION_SLUGS } from "@/lib/data/options";
import { formatDate } from "@/lib/format";
import { BeheerPagination } from "@/components/beheer/beheer-pagination";
import { EmptyState } from "@/components/beheer/empty-state";
import { ListToolbar } from "@/components/beheer/list-toolbar";
import { PageHeader } from "@/components/beheer/page-header";
import { ResponsiveList, rowLinkClass, type Column } from "@/components/beheer/responsive-list";
import { StatusBadge } from "@/components/beheer/status-badge";
import { StatusTabs } from "@/components/beheer/status-tabs";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { listStaffRequests, type StaffRequestListRow } from "../../_data/staff-requests";
import { listAdminOptions, listOccupationOptions } from "../../_data/vacancies";
import { requireAdmin } from "../../_lib/auth";
import { formatRelativeNl } from "../../_lib/format";
import { beheerPaths } from "../../_lib/paths";
import { pickTab, STAFF_REQUEST_TABS } from "../../_lib/status";
import type { StaffRequestTab } from "../../_lib/types";
import { listHref, oneOf, pageParam } from "../../_lib/url";
import { firstParam } from "../../_lib/validation/common";
import { S, fill } from "../../_strings";

export const metadata: Metadata = { title: S.requests.metaTitle };

const TAB_KEYS = Object.keys(STAFF_REQUEST_TABS) as StaffRequestTab[];

/** Personeelsaanvragen (spec 08 §4.9). */
export default async function StaffRequestsPage({ searchParams }: PageProps<"/beheer/aanvragen">) {
  const ctx = await requireAdmin();
  const params = await searchParams;
  const tab = pickTab<StaffRequestTab>(params.tab, STAFF_REQUEST_TABS, "open");
  const q = firstParam(params.q)?.slice(0, 80);
  const beroep = oneOf(params.beroep, OCCUPATION_SLUGS);
  const periodeRaw = oneOf(params.periode, ["7", "30", "90"] as const);
  const periode = periodeRaw ? (Number(periodeRaw) as 7 | 30 | 90) : undefined;
  const page = pageParam(params.pagina);
  const [occupations, admins] = await Promise.all([listOccupationOptions(ctx), listAdminOptions(ctx)]);
  const toegewezenRaw = firstParam(params.toegewezen);
  const toegewezen =
    toegewezenRaw === "niemand" ? "niemand" : admins.some((a) => a.id === toegewezenRaw) ? toegewezenRaw : undefined;
  const result = await listStaffRequests(ctx, { tab, q, beroep, periode, toegewezen, page });
  const R = S.requests;
  const C = R.columns;
  const plural = new Map(occupations.map((o) => [o.slug as string, o.pluralNl]));
  const filtered = Boolean(q || beroep || periode || toegewezen);

  const requested = (r: StaffRequestListRow) =>
    [
      ...r.occupationSlugs.map((s) => plural.get(s) ?? s),
      ...(r.occupationOther ? [fill(R.other, { tekst: r.occupationOther })] : []),
    ].join(", ");
  const start = (r: StaffRequestListRow) => (r.startAsap ? R.asap : r.startDate ? formatDate(r.startDate, "nl") : "");

  const columns: Column<StaffRequestListRow>[] = [
    {
      key: "company",
      header: C.company,
      cell: (r) => (
        <Link href={beheerPaths.request(r.reference)} className={rowLinkClass()}>
          {r.companyName}
        </Link>
      ),
    },
    { key: "contact", header: C.contact, cell: (r) => r.contactName },
    { key: "requested", header: C.requested, cell: requested, className: "max-w-56" },
    { key: "headcount", header: C.headcount, cell: (r) => r.headcount, className: "tabular-nums" },
    { key: "start", header: C.start, cell: start },
    { key: "workCity", header: C.workCity, cell: (r) => r.workCity },
    { key: "received", header: C.received, cell: (r) => formatRelativeNl(r.createdAt) },
    { key: "status", header: C.status, cell: (r) => <StatusBadge kind="staffRequest" status={r.status} /> },
    { key: "assigned", header: C.assigned, cell: (r) => r.assignedName ?? S.common.nobody },
  ];

  const empty = filtered ? (
    <EmptyState
      body={q ? fill(S.empty.search, { zoekterm: q }) : S.empty.vacanciesFiltered}
      action={
        <Link href={listHref(beheerPaths.requests, {}, { tab })} className={ctaButtonVariants({ variant: "secondary", size: "sm" })}>
          {S.common.clearFilters}
        </Link>
      }
    />
  ) : (
    <EmptyState body={S.empty.requestsNone} />
  );

  return (
    <>
      <PageHeader title={R.title} />
      <StatusTabs
        label={R.tabsLabel}
        activeKey={tab}
        tabs={TAB_KEYS.map((key) => ({
          key,
          label: R.tabs[key],
          count: result.tabCounts[key],
          href: listHref(beheerPaths.requests, params, { tab: key, pagina: null }),
        }))}
      />
      <ListToolbar
        searchLabel={R.searchLabel}
        searchPlaceholder={R.searchPlaceholder}
        filters={[
          { name: "beroep", label: S.applications.filterOccupation, options: occupations.map((o) => ({ value: o.slug, label: o.nameNl })) },
          {
            name: "periode",
            label: S.applications.filterPeriod,
            options: (["7", "30", "90"] as const).map((p) => ({ value: p, label: S.applications.period[p] })),
          },
          {
            name: "toegewezen",
            label: S.applications.filterAssigned,
            options: [{ value: "niemand", label: S.common.nobody }, ...admins.map((a) => ({ value: a.id, label: a.displayName }))],
          },
        ]}
      />
      <ResponsiveList
        caption={R.caption}
        columns={columns}
        rows={result.rows}
        rowKey={(r) => r.id}
        empty={empty}
        card={(r) => (
          <div className="grid gap-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 text-[1.0625rem] leading-snug wrap-anywhere">
                <Link href={beheerPaths.request(r.reference)} className={rowLinkClass(true)}>
                  {r.companyName}
                </Link>
              </h3>
              <StatusBadge kind="staffRequest" status={r.status} />
            </div>
            <p className="grid gap-0.5 text-sm text-muted-foreground">
              <span>{`${r.headcount} ${requested(r)}`}</span>
              <span>{[r.workCity, start(r), formatRelativeNl(r.createdAt)].filter(Boolean).join(", ")}</span>
            </p>
          </div>
        )}
      />
      <BeheerPagination
        page={page}
        pageCount={result.pageCount}
        label={S.common.pagination}
        hrefFor={(p) => listHref(beheerPaths.requests, params, { pagina: p })}
      />
    </>
  );
}
