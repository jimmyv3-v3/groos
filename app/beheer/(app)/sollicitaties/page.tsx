import type { Metadata } from "next";
import Link from "next/link";
import { OCCUPATION_SLUGS } from "@/lib/data/options";
import { BeheerPagination } from "@/components/beheer/beheer-pagination";
import { ContactActions } from "@/components/beheer/contact-actions";
import { EmptyState } from "@/components/beheer/empty-state";
import { ListToolbar } from "@/components/beheer/list-toolbar";
import { PageHeader } from "@/components/beheer/page-header";
import { ResponsiveList, rowLinkClass, type Column } from "@/components/beheer/responsive-list";
import { StatusBadge } from "@/components/beheer/status-badge";
import { StatusTabs } from "@/components/beheer/status-tabs";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { listApplications, type ApplicationListRow } from "../../_data/applications";
import { listAdminOptions, listOccupationOptions, listVacancyOptions } from "../../_data/vacancies";
import { requireAdmin } from "../../_lib/auth";
import { formatDateNl, formatPhoneNl, formatRelativeNl } from "../../_lib/format";
import { beheerPaths } from "../../_lib/paths";
import { APPLICATION_TABS, pickTab } from "../../_lib/status";
import type { ApplicationTab } from "../../_lib/types";
import { listHref, oneOf, pageParam } from "../../_lib/url";
import { firstParam } from "../../_lib/validation/common";
import { S, fill } from "../../_strings";

export const metadata: Metadata = { title: S.applications.metaTitle };

const TAB_KEYS = Object.keys(APPLICATION_TABS) as ApplicationTab[];

/** Sollicitaties met tabbladen, filters en zoeken (spec 08 §4.8). */
export default async function ApplicationsPage({ searchParams }: PageProps<"/beheer/sollicitaties">) {
  const ctx = await requireAdmin();
  const params = await searchParams;
  const tab = pickTab<ApplicationTab>(params.tab, APPLICATION_TABS, "open");
  const q = firstParam(params.q)?.slice(0, 80);
  const rawVacancy = firstParam(params.vacature);
  const vacature = rawVacancy === "inschrijving" ? "inschrijving" : rawVacancy && /^\d+$/.test(rawVacancy) ? Number(rawVacancy) : undefined;
  const beroep = oneOf(params.beroep, OCCUPATION_SLUGS);
  const cv = oneOf(params.cv, ["met", "zonder"] as const);
  const periodeRaw = oneOf(params.periode, ["7", "30", "90"] as const);
  const periode = periodeRaw ? (Number(periodeRaw) as 7 | 30 | 90) : undefined;
  const page = pageParam(params.pagina);

  const [occupations, admins, vacancies] = await Promise.all([
    listOccupationOptions(ctx),
    listAdminOptions(ctx),
    listVacancyOptions(ctx),
  ]);
  const toegewezenRaw = firstParam(params.toegewezen);
  const toegewezen =
    toegewezenRaw === "niemand" ? "niemand" : admins.some((a) => a.id === toegewezenRaw) ? toegewezenRaw : undefined;
  const result = await listApplications(ctx, { tab, q, vacature, beroep, cv, periode, toegewezen, page });
  const A = S.applications;
  const C = A.columns;
  const filtered = Boolean(q || vacature || beroep || cv || periode || toegewezen);

  const vacancyText = (r: ApplicationListRow) =>
    r.kind === "registration"
      ? A.registration
      : `${r.vacancyTitle ?? ""}${r.vacancyNumber ? ` (${r.vacancyNumber})` : ""}`;
  const whatsappText = (r: ApplicationListRow) =>
    r.kind === "registration"
      ? fill(A.detail.whatsappTextRegistration, { voornaam: r.firstName, beheerder: ctx.profile.displayName })
      : fill(A.detail.whatsappText, { voornaam: r.firstName, beheerder: ctx.profile.displayName, vacature: r.vacancyTitle ?? "" });

  const columns: Column<ApplicationListRow>[] = [
    {
      key: "name",
      header: C.name,
      cell: (r) => (
        <Link href={beheerPaths.application(r.reference)} className={rowLinkClass()}>
          {r.fullName}
        </Link>
      ),
    },
    { key: "vacancy", header: C.vacancy, cell: vacancyText, className: "max-w-56" },
    { key: "city", header: C.city, cell: (r) => r.city ?? "" },
    { key: "phone", header: C.phone, cell: (r) => (r.phoneE164 ? formatPhoneNl(r.phoneE164) : ""), className: "whitespace-nowrap tabular-nums" },
    { key: "received", header: C.received, cell: (r) => formatRelativeNl(r.createdAt) },
    { key: "status", header: C.status, cell: (r) => <StatusBadge kind="application" status={r.status} /> },
    { key: "cv", header: C.cv, cell: (r) => (r.hasCv ? A.hasCv : A.noCv) },
    { key: "assigned", header: C.assigned, cell: (r) => r.assignedName ?? S.common.nobody },
    { key: "retain", header: C.retainUntil, cell: (r) => formatDateNl(r.retainUntil) },
  ];

  const empty = filtered ? (
    <EmptyState
      body={q ? fill(S.empty.search, { zoekterm: q }) : S.empty.vacanciesFiltered}
      action={
        <Link href={listHref(beheerPaths.applications, {}, { tab })} className={ctaButtonVariants({ variant: "secondary", size: "sm" })}>
          {S.common.clearFilters}
        </Link>
      }
    />
  ) : (
    <EmptyState body={tab === "nieuw" && result.tabCounts.alle > 0 ? S.empty.applicationsNew : S.empty.applicationsNone} />
  );

  return (
    <>
      <PageHeader title={A.title} />
      <StatusTabs
        label={A.tabsLabel}
        activeKey={tab}
        tabs={TAB_KEYS.map((key) => ({
          key,
          label: A.tabs[key],
          count: result.tabCounts[key],
          href: listHref(beheerPaths.applications, params, { tab: key, pagina: null }),
        }))}
      />
      <ListToolbar
        searchLabel={A.searchLabel}
        searchPlaceholder={A.searchPlaceholder}
        filters={[
          {
            name: "vacature",
            label: A.filterVacancy,
            options: [
              { value: "inschrijving", label: A.filterRegistration },
              ...vacancies.map((v) => ({ value: String(v.number), label: `${v.number} ${v.title}` })),
            ],
          },
          { name: "beroep", label: A.filterOccupation, options: occupations.map((o) => ({ value: o.slug, label: o.nameNl })) },
          { name: "cv", label: A.filterCv, options: [{ value: "met", label: A.cvWith }, { value: "zonder", label: A.cvWithout }] },
          { name: "periode", label: A.filterPeriod, options: (["7", "30", "90"] as const).map((p) => ({ value: p, label: A.period[p] })) },
          {
            name: "toegewezen",
            label: A.filterAssigned,
            options: [{ value: "niemand", label: S.common.nobody }, ...admins.map((a) => ({ value: a.id, label: a.displayName }))],
          },
        ]}
      />
      <ResponsiveList
        caption={A.caption}
        columns={columns}
        rows={result.rows}
        rowKey={(r) => r.id}
        empty={empty}
        card={(r) => (
          <div className="grid gap-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 text-[1.0625rem] leading-snug wrap-anywhere">
                <Link href={beheerPaths.application(r.reference)} className={rowLinkClass(true)}>
                  {r.fullName}
                </Link>
              </h3>
              <StatusBadge kind="application" status={r.status} />
            </div>
            <p className="grid gap-0.5 text-sm text-muted-foreground">
              <span>{vacancyText(r)}</span>
              <span>{[r.city, formatRelativeNl(r.createdAt)].filter(Boolean).join(", ")}</span>
            </p>
            <ContactActions
              entityType="application"
              entityId={r.id}
              phoneE164={r.phoneE164}
              email={null}
              name={r.fullName}
              whatsappText={whatsappText(r)}
              mailSubject={A.detail.mailSubject}
              layout="inline"
            />
          </div>
        )}
      />
      <BeheerPagination
        page={page}
        pageCount={result.pageCount}
        label={S.common.pagination}
        hrefFor={(p) => listHref(beheerPaths.applications, params, { pagina: p })}
      />
    </>
  );
}
