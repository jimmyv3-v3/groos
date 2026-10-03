import "server-only";
import { RETENTION_DAYS } from "@/lib/data/options";
import type { AdminContext } from "../_lib/auth";
import { amsterdamDateKey, amsterdamLocalToIso, formatDateNl, formatTimeNl, subtractWorkdays } from "../_lib/format";
import { beheerPaths } from "../_lib/paths";
import type { ActivityItem, TodoItem } from "../_lib/types";
import { S, fill } from "../_strings";
import { listRecentActivities } from "./activities";

const DAY = 24 * 60 * 60 * 1000;
const TODO_LIMIT = 5;

export type TodoGroup = { items: TodoItem[]; total: number };

export type Dashboard = {
  tiles: { applicationsNew: number; requestsOpen: number; messagesNew: number; vacanciesOnline: number; closingSoon: number };
  todo: {
    staleNew: TodoGroup;
    nearAutoClose: TodoGroup;
    requestsNew: TodoGroup;
    closingSoon: TodoGroup;
    scheduledToday: TodoGroup;
    emailFailed: TodoGroup;
  };
  recent: ActivityItem[];
};

const fullName = (a: { first_name: string | null; last_name: string | null; reference: string }) =>
  [a.first_name, a.last_name].filter(Boolean).join(" ") || a.reference;

export async function getDashboard(ctx: AdminContext): Promise<Dashboard> {
  const now = new Date();
  const nowIso = now.toISOString();
  const staleBefore = subtractWorkdays(now, 2).toISOString();
  const reminderBefore = new Date(now.getTime() - RETENTION_DAYS.staleReminder * DAY).toISOString();
  const weekAhead = new Date(now.getTime() + 7 * DAY).toISOString();
  const today = amsterdamDateKey(now);
  const todayStart = amsterdamLocalToIso(`${today}T00:00`);
  const todayEnd = amsterdamLocalToIso(`${today}T23:59`);
  const isOwner = ctx.profile.role === "owner";
  const sb = ctx.supabase;

  const [
    appsNew,
    reqOpen,
    msgsNew,
    online,
    staleNew,
    nearAuto,
    reqNew,
    closing,
    scheduled,
    emails,
    recent,
  ] = await Promise.all([
    sb.from("applications").select("id", { count: "exact", head: true }).eq("status", "new").is("anonymized_at", null),
    sb
      .from("staff_requests")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "in_progress", "quote_sent", "started"]),
    sb.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("public_vacancies").select("id", { count: "exact", head: true }).eq("state", "open"),
    sb
      .from("applications")
      .select("id, reference, first_name, last_name, created_at", { count: "exact" })
      .eq("status", "new")
      .is("anonymized_at", null)
      .lt("created_at", staleBefore)
      .order("created_at")
      .limit(TODO_LIMIT),
    sb
      .from("applications")
      .select("id, reference, first_name, last_name, created_at, last_contact_at", { count: "exact" })
      .in("status", ["new", "in_progress", "invited"])
      .is("anonymized_at", null)
      .or(`last_contact_at.lt.${reminderBefore},and(last_contact_at.is.null,created_at.lt.${reminderBefore})`)
      .order("created_at")
      .limit(TODO_LIMIT),
    sb
      .from("staff_requests")
      .select("id, reference, company_name, headcount", { count: "exact" })
      .eq("status", "new")
      .order("created_at")
      .limit(TODO_LIMIT),
    sb
      .from("vacancies")
      .select("id, number, closes_at, nl:vacancy_translations!inner(title)", { count: "exact" })
      .eq("vacancy_translations.locale", "nl")
      .eq("status", "published")
      .gt("closes_at", nowIso)
      .lte("closes_at", weekAhead)
      .order("closes_at")
      .limit(TODO_LIMIT),
    sb
      .from("vacancies")
      .select("id, number, publish_at, nl:vacancy_translations!inner(title)", { count: "exact" })
      .eq("vacancy_translations.locale", "nl")
      .eq("status", "scheduled")
      .gte("publish_at", todayStart)
      .lte("publish_at", todayEnd)
      .order("publish_at")
      .limit(TODO_LIMIT),
    isOwner
      ? sb
          .from("email_log")
          .select("id, entity_type, entity_id, template", { count: "exact" })
          .in("status", ["failed", "bounced"])
          .gte("created_at", new Date(now.getTime() - 7 * DAY).toISOString())
          .order("created_at", { ascending: false })
          .limit(TODO_LIMIT)
      : null,
    listRecentActivities(ctx, 10),
  ]);

  for (const r of [appsNew, reqOpen, msgsNew, online, staleNew, nearAuto, reqNew, closing, scheduled]) {
    if (r.error) throw r.error;
  }

  const scheduledErrors = await Promise.all(
    (scheduled.data ?? []).map((v) => sb.rpc("vacancy_publish_errors", { p_vacancy_id: v.id })),
  );

  // Referenties voor mislukte e-mails over sollicitaties en aanvragen.
  const emailRows = emails?.data ?? [];
  const appIds = emailRows.filter((e) => e.entity_type === "application" && e.entity_id).map((e) => e.entity_id!);
  const reqIds = emailRows.filter((e) => e.entity_type === "staff_request" && e.entity_id).map((e) => e.entity_id!);
  const [emailApps, emailReqs] = await Promise.all([
    appIds.length ? sb.from("applications").select("id, reference").in("id", appIds) : null,
    reqIds.length ? sb.from("staff_requests").select("id, reference").in("id", reqIds) : null,
  ]);
  const refs = new Map<string, { reference: string; href: string }>();
  for (const a of emailApps?.data ?? []) refs.set(a.id, { reference: a.reference, href: beheerPaths.application(a.reference) });
  for (const r of emailReqs?.data ?? []) refs.set(r.id, { reference: r.reference, href: beheerPaths.request(r.reference) });

  return {
    tiles: {
      applicationsNew: appsNew.count ?? 0,
      requestsOpen: reqOpen.count ?? 0,
      messagesNew: msgsNew.count ?? 0,
      vacanciesOnline: online.count ?? 0,
      closingSoon: closing.count ?? 0,
    },
    todo: {
      staleNew: {
        total: staleNew.count ?? 0,
        items: (staleNew.data ?? []).map((a) => ({
          id: a.id,
          text: fill(S.dashboard.todo.staleNewItem, { naam: fullName(a), datum: formatDateNl(a.created_at) }),
          href: beheerPaths.application(a.reference),
          tone: "brand" as const,
        })),
      },
      nearAutoClose: {
        total: nearAuto.count ?? 0,
        items: (nearAuto.data ?? []).map((a) => {
          const base = Date.parse(a.last_contact_at ?? a.created_at);
          return {
            id: a.id,
            text: fill(S.dashboard.todo.nearAutoCloseItem, {
              naam: fullName(a),
              datum: formatDateNl(new Date(base + RETENTION_DAYS.staleAutoClose * DAY)),
            }),
            href: beheerPaths.application(a.reference),
            tone: "warning" as const,
          };
        }),
      },
      requestsNew: {
        total: reqNew.count ?? 0,
        items: (reqNew.data ?? []).map((r) => ({
          id: r.id,
          text: fill(S.dashboard.todo.requestsNewItem, { bedrijf: r.company_name, aantal: r.headcount }),
          href: beheerPaths.request(r.reference),
          tone: "brand" as const,
        })),
      },
      closingSoon: {
        total: closing.count ?? 0,
        items: (closing.data ?? []).map((v) => ({
          id: v.id,
          text: fill(S.dashboard.todo.closingSoonItem, {
            titel: v.nl[0]?.title ?? "",
            datum: v.closes_at ? formatDateNl(v.closes_at) : "",
          }),
          href: beheerPaths.vacancy(v.number),
          tone: "warning" as const,
          extendId: v.id,
        })),
      },
      scheduledToday: {
        total: scheduled.count ?? 0,
        items: (scheduled.data ?? []).map((v, i) => {
          const invalid = (scheduledErrors[i]?.data ?? []).length > 0;
          const titel = v.nl[0]?.title ?? "";
          return {
            id: v.id,
            text: invalid
              ? fill(S.dashboard.todo.scheduledInvalidItem, { titel })
              : fill(S.dashboard.todo.scheduledTodayItem, { titel, tijd: v.publish_at ? formatTimeNl(v.publish_at) : "" }),
            href: beheerPaths.vacancy(v.number),
            tone: invalid ? ("danger" as const) : ("info" as const),
          };
        }),
      },
      emailFailed: {
        total: emails?.count ?? 0,
        items: emailRows.map((e) => {
          const ref = e.entity_id ? refs.get(e.entity_id) : undefined;
          return {
            id: String(e.id),
            text: fill(S.dashboard.todo.emailFailedItem, { referentie: ref?.reference ?? e.template }),
            href: ref?.href ?? beheerPaths.home,
            tone: "danger" as const,
          };
        }),
      },
    },
    recent,
  };
}
