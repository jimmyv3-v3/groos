import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_TOPICS } from "@/lib/data/options";
import { BeheerPagination } from "@/components/beheer/beheer-pagination";
import { EmptyState } from "@/components/beheer/empty-state";
import { ListToolbar } from "@/components/beheer/list-toolbar";
import { PageHeader } from "@/components/beheer/page-header";
import { ResponsiveList, rowLinkClass, type Column } from "@/components/beheer/responsive-list";
import { StatusBadge } from "@/components/beheer/status-badge";
import { StatusTabs } from "@/components/beheer/status-tabs";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { listMessages, type MessageListRow } from "../../_data/messages";
import { requireAdmin } from "../../_lib/auth";
import { formatPhoneNl, formatRelativeNl } from "../../_lib/format";
import { beheerPaths } from "../../_lib/paths";
import { MESSAGE_TABS, pickTab } from "../../_lib/status";
import type { MessageTab } from "../../_lib/types";
import { listHref, oneOf, pageParam } from "../../_lib/url";
import { firstParam } from "../../_lib/validation/common";
import { S, fill } from "../../_strings";

export const metadata: Metadata = { title: S.messages.metaTitle };

const TAB_KEYS = Object.keys(MESSAGE_TABS) as MessageTab[];

/** Berichten via het contactformulier (spec 08 §4.10). */
export default async function MessagesPage({ searchParams }: PageProps<"/beheer/berichten">) {
  const ctx = await requireAdmin();
  const params = await searchParams;
  const tab = pickTab<MessageTab>(params.tab, MESSAGE_TABS, "nieuw");
  const q = firstParam(params.q)?.slice(0, 80);
  const onderwerp = oneOf(params.onderwerp, CONTACT_TOPICS);
  const page = pageParam(params.pagina);
  const result = await listMessages(ctx, { tab, q, onderwerp, page });
  const M = S.messages;
  const C = M.columns;
  const reachable = (r: MessageListRow) => (r.phoneE164 ? formatPhoneNl(r.phoneE164) : (r.email ?? ""));

  const columns: Column<MessageListRow>[] = [
    {
      key: "name",
      header: C.name,
      cell: (r) => (
        <Link href={beheerPaths.message(r.id)} className={rowLinkClass()}>
          {r.name}
        </Link>
      ),
    },
    { key: "topic", header: C.topic, cell: (r) => S.options.topic[r.topic] },
    { key: "reachable", header: C.reachable, cell: reachable },
    { key: "received", header: C.received, cell: (r) => formatRelativeNl(r.createdAt) },
    { key: "status", header: C.status, cell: (r) => <StatusBadge kind="message" status={r.status} /> },
  ];

  const empty =
    q || onderwerp ? (
      <EmptyState
        body={q ? fill(S.empty.search, { zoekterm: q }) : S.empty.vacanciesFiltered}
        action={
          <Link href={listHref(beheerPaths.messages, {}, { tab })} className={ctaButtonVariants({ variant: "secondary", size: "sm" })}>
            {S.common.clearFilters}
          </Link>
        }
      />
    ) : (
      <EmptyState body={S.empty.messagesNone} />
    );

  return (
    <>
      <PageHeader title={M.title} />
      <StatusTabs
        label={M.tabsLabel}
        activeKey={tab}
        tabs={TAB_KEYS.map((key) => ({
          key,
          label: M.tabs[key],
          count: result.tabCounts[key],
          href: listHref(beheerPaths.messages, params, { tab: key, pagina: null }),
        }))}
      />
      <ListToolbar
        searchLabel={M.searchLabel}
        searchPlaceholder={S.applications.searchPlaceholder}
        filters={[{ name: "onderwerp", label: M.filterTopic, options: CONTACT_TOPICS.map((t) => ({ value: t, label: S.options.topic[t] })) }]}
      />
      <ResponsiveList
        caption={M.caption}
        columns={columns}
        rows={result.rows}
        rowKey={(r) => r.id}
        empty={empty}
        card={(r) => (
          <div className="grid gap-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[1.0625rem] leading-snug">
                <Link href={beheerPaths.message(r.id)} className={rowLinkClass(true)}>
                  {r.name}
                </Link>
              </h3>
              <StatusBadge kind="message" status={r.status} />
            </div>
            <p className="grid gap-0.5 text-sm text-muted-foreground">
              <span>{S.options.topic[r.topic]}</span>
              <span>{[reachable(r), formatRelativeNl(r.createdAt)].filter(Boolean).join(", ")}</span>
            </p>
          </div>
        )}
      />
      <BeheerPagination
        page={page}
        pageCount={result.pageCount}
        label={S.common.pagination}
        hrefFor={(p) => listHref(beheerPaths.messages, params, { pagina: p })}
      />
    </>
  );
}
