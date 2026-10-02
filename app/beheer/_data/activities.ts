import "server-only";
import type { Json } from "@/lib/database.types";
import type { AdminContext } from "../_lib/auth";
import { beheerPaths } from "../_lib/paths";
import type { ActivityItem, EntityType } from "../_lib/types";
import { S, fill } from "../_strings";

const SELECT = "id, kind, body, payload, created_at, entity_type, entity_id, actor:admin_profiles!actor_id(display_name)";

type Row = {
  id: string;
  kind: ActivityItem["kind"];
  body: string | null;
  payload: Json | null;
  created_at: string;
  entity_type: EntityType;
  entity_id: string;
  actor: { display_name: string } | null;
};

function toItem(row: Row, entity?: ActivityItem["entity"]): ActivityItem {
  const payload = row.payload && typeof row.payload === "object" && !Array.isArray(row.payload) ? row.payload : null;
  return {
    id: row.id,
    kind: row.kind,
    actorName: row.actor?.display_name ?? null,
    body: row.body,
    payload: payload as Record<string, unknown> | null,
    createdAt: row.created_at,
    ...(entity ? { entity } : {}),
  };
}

/** Zet bij "assigned" de naam van de nieuwe beheerder in payload.toName. */
async function withAssigneeNames(ctx: AdminContext, items: ActivityItem[]): Promise<ActivityItem[]> {
  const ids = [
    ...new Set(
      items
        .filter((i) => i.kind === "assigned" && typeof i.payload?.to === "string")
        .map((i) => i.payload!.to as string),
    ),
  ];
  if (ids.length === 0) return items;
  const { data } = await ctx.supabase.from("admin_profiles").select("id, display_name").in("id", ids);
  const names = new Map((data ?? []).map((a) => [a.id, a.display_name]));
  return items.map((i) =>
    i.kind === "assigned" && typeof i.payload?.to === "string" && names.has(i.payload.to)
      ? { ...i, payload: { ...i.payload, toName: names.get(i.payload.to) } }
      : i,
  );
}

/** Tijdlijn van één onderdeel, nieuwste eerst (standaard 50). */
export async function listActivities(
  ctx: AdminContext,
  entityType: EntityType,
  entityId: string,
  limit = 50,
): Promise<ActivityItem[]> {
  const { data, error } = await ctx.supabase
    .from("activities")
    .select(SELECT)
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return withAssigneeNames(
    ctx,
    (data as unknown as Row[]).map((r) => toItem(r)),
  );
}

/** Laatste regels over alle onderdelen, met een label en link per onderdeel (standaard 10). */
export async function listRecentActivities(ctx: AdminContext, limit = 10): Promise<ActivityItem[]> {
  const { data, error } = await ctx.supabase
    .from("activities")
    .select(SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  const rows = data as unknown as Row[];
  if (rows.length === 0) return [];

  const ids = (t: EntityType) => [...new Set(rows.filter((r) => r.entity_type === t).map((r) => r.entity_id))];
  const [vac, app, req, msg] = await Promise.all([
    ids("vacancy").length
      ? ctx.supabase
          .from("vacancies")
          .select("id, number, nl:vacancy_translations!inner(title)")
          .eq("vacancy_translations.locale", "nl")
          .in("id", ids("vacancy"))
      : null,
    ids("application").length
      ? ctx.supabase.from("applications").select("id, reference, first_name, last_name").in("id", ids("application"))
      : null,
    ids("staff_request").length
      ? ctx.supabase.from("staff_requests").select("id, reference, company_name").in("id", ids("staff_request"))
      : null,
    ids("contact_message").length
      ? ctx.supabase.from("contact_messages").select("id, name").in("id", ids("contact_message"))
      : null,
  ]);

  const labels = new Map<string, ActivityItem["entity"]>();
  for (const v of vac?.data ?? []) {
    labels.set(v.id, {
      label: `${fill(S.vacancies.number, { nummer: v.number })}, ${v.nl[0]?.title ?? ""}`,
      href: beheerPaths.vacancy(v.number),
    });
  }
  for (const a of app?.data ?? []) {
    const name = [a.first_name, a.last_name].filter(Boolean).join(" ") || a.reference;
    labels.set(a.id, { label: name, href: beheerPaths.application(a.reference) });
  }
  for (const r of req?.data ?? []) labels.set(r.id, { label: r.company_name, href: beheerPaths.request(r.reference) });
  for (const m of msg?.data ?? []) labels.set(m.id, { label: m.name, href: beheerPaths.message(m.id) });

  return withAssigneeNames(
    ctx,
    rows.map((r) => toItem(r, labels.get(r.entity_id))),
  );
}
