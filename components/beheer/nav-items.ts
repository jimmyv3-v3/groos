import { BriefcaseBusiness, Building2, Ellipsis, Inbox, LayoutDashboard, Users, type LucideIcon } from "lucide-react";
import { beheerPaths } from "@/app/beheer/_lib/paths";
import type { NavCounts } from "@/app/beheer/_lib/types";
import { S } from "@/app/beheer/_strings";

export type NavItem = { href: string; label: string; icon: LucideIcon; count?: keyof NavCounts | "more" };

/** Sidebar vanaf lg (spec 08 §4.4 punt 3). */
export const SIDEBAR_ITEMS: NavItem[] = [
  { href: beheerPaths.home, label: S.nav.dashboard, icon: LayoutDashboard },
  { href: beheerPaths.vacancies, label: S.nav.vacancies, icon: BriefcaseBusiness },
  { href: beheerPaths.applications, label: S.nav.applications, icon: Users, count: "applicationsNew" },
  { href: beheerPaths.requests, label: S.nav.requestsLong, icon: Building2, count: "requestsNew" },
  { href: beheerPaths.messages, label: S.nav.messages, icon: Inbox, count: "messagesNew" },
];

/** Tabbalk onder lg: vijf items, Berichten onder Meer (spec 08 §4.4 punt 6). */
export const TAB_ITEMS: NavItem[] = [
  { href: beheerPaths.home, label: S.nav.dashboard, icon: LayoutDashboard },
  { href: beheerPaths.vacancies, label: S.nav.vacancies, icon: BriefcaseBusiness },
  { href: beheerPaths.applications, label: S.nav.applications, icon: Users, count: "applicationsNew" },
  { href: beheerPaths.requests, label: S.nav.requests, icon: Building2, count: "requestsNew" },
  { href: beheerPaths.more, label: S.nav.more, icon: Ellipsis, count: "more" },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === beheerPaths.home) return pathname === href;
  if (href === beheerPaths.more) return pathname === href || pathname.startsWith(beheerPaths.messages);
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function countFor(item: NavItem, counts: NavCounts): number {
  if (!item.count) return 0;
  return item.count === "more" ? counts.messagesNew : counts[item.count];
}
