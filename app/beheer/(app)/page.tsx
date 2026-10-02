import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { ActivityFeed } from "@/components/beheer/activity-feed";
import { EmptyState } from "@/components/beheer/empty-state";
import { PageHeader } from "@/components/beheer/page-header";
import { SectionCard } from "@/components/beheer/section-card";
import { StatTile } from "@/components/beheer/stat-tile";
import { TodoList } from "@/components/beheer/todo-list";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { getDashboard } from "../_data/dashboard";
import { requireAdmin } from "../_lib/auth";
import { greetingKey } from "../_lib/format";
import { beheerPaths } from "../_lib/paths";
import { S, fill } from "../_strings";

export const metadata: Metadata = { title: S.dashboard.metaTitle };

/** Overzicht: wat vandaag aandacht vraagt (spec 08 §4.6). */
export default async function DashboardPage() {
  const ctx = await requireAdmin();
  const data = await getDashboard(ctx);
  const T = S.dashboard.todo;
  const groups = [
    { key: "staleNew", title: T.staleNew, group: data.todo.staleNew, allHref: `${beheerPaths.applications}?tab=nieuw` },
    { key: "nearAutoClose", title: T.nearAutoClose, group: data.todo.nearAutoClose, allHref: `${beheerPaths.applications}?tab=open` },
    { key: "requestsNew", title: T.requestsNew, group: data.todo.requestsNew, allHref: `${beheerPaths.requests}?tab=nieuw` },
    { key: "closingSoon", title: T.closingSoon, group: data.todo.closingSoon, allHref: `${beheerPaths.vacancies}?tab=online&sortering=sluitdatum` },
    { key: "scheduledToday", title: T.scheduledToday, group: data.todo.scheduledToday, allHref: `${beheerPaths.vacancies}?tab=gepland` },
    { key: "emailFailed", title: T.emailFailed, group: data.todo.emailFailed },
  ]
    .filter((g) => g.group.items.length > 0)
    .map((g) => ({ key: g.key, title: g.title, items: g.group.items, total: g.group.total, allHref: g.allHref }));

  return (
    <>
      <PageHeader
        title={fill(S.dashboard.greeting[greetingKey()], { naam: ctx.profile.displayName })}
        actions={
          <>
            <Link href={beheerPaths.vacancyNew} className={ctaButtonVariants()}>
              <Plus aria-hidden="true" />
              {S.dashboard.newVacancy}
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className={ctaButtonVariants({ variant: "secondary" })}>
              <ExternalLink aria-hidden="true" />
              {S.app.viewSite}
            </a>
          </>
        }
      />
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatTile label={S.dashboard.tiles.applicationsNew} value={data.tiles.applicationsNew} href={`${beheerPaths.applications}?tab=nieuw`} tone="brand" />
          <StatTile label={S.dashboard.tiles.requestsOpen} value={data.tiles.requestsOpen} href={`${beheerPaths.requests}?tab=open`} tone="brand" />
          <StatTile label={S.dashboard.tiles.messagesNew} value={data.tiles.messagesNew} href={`${beheerPaths.messages}?tab=nieuw`} tone="brand" />
          <StatTile label={S.dashboard.tiles.vacanciesOnline} value={data.tiles.vacanciesOnline} href={`${beheerPaths.vacancies}?tab=online`} tone="success" />
          <StatTile label={S.dashboard.tiles.closingSoon} value={data.tiles.closingSoon} href={`${beheerPaths.vacancies}?tab=online&sortering=sluitdatum`} tone="warning" />
        </div>
        <SectionCard id="vandaag" title={T.title}>
          {groups.length > 0 ? <TodoList groups={groups} /> : <EmptyState body={S.empty.dashboard} />}
        </SectionCard>
        <SectionCard id="recent" title={S.dashboard.recent}>
          <ActivityFeed items={data.recent} showEntity emptyText={S.empty.timeline} />
        </SectionCard>
      </div>
    </>
  );
}
