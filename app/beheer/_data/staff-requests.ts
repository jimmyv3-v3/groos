import "server-only";
import type { OccupationSlug, RequestDuration, StaffRequestStatus } from "@/lib/data/options";
import type { AdminContext } from "../_lib/auth";
import { searchTerms } from "../_lib/search";
import { countTabs, STAFF_REQUEST_TABS } from "../_lib/status";
import type { ActivityItem, StaffRequestTab } from "../_lib/types";
import { listActivities } from "./activities";
import { PAGE_SIZE } from "./vacancies";

export type StaffRequestListRow = {
  id: string;
  reference: string;
  status: StaffRequestStatus;
  companyName: string;
  contactName: string;
  occupationSlugs: string[];
  occupationOther: string | null;
  headcount: number;
  startAsap: boolean;
  startDate: string | null;
  workCity: string;
  createdAt: string;
  assignedName: string | null;
  phoneE164: string;
  email: string;
};

export type StaffRequestDetail = StaffRequestListRow & {
  duration: RequestDuration;
  hoursPerWeek: number | null;
  kvkNumber: string | null;
  description: string | null;
  assignedTo: string | null;
  timeline: ActivityItem[];
};

const LIST_SELECT =
  "id, reference, status, company_name, contact_name, occupation_slugs, occupation_other, headcount, start_asap, start_date, work_city, created_at, phone_e164, email, assigned:admin_profiles!assigned_to(display_name)";

type Raw = {
  id: string;
  reference: string;
  status: StaffRequestStatus;
  company_name: string;
  contact_name: string;
  occupation_slugs: string[];
  occupation_other: string | null;
  headcount: number;
  start_asap: boolean;
  start_date: string | null;
  work_city: string;
  created_at: string;
  phone_e164: string;
  email: string;
  assigned: { display_name: string } | null;
};

function toRow(r: Raw): StaffRequestListRow {
  return {
    id: r.id,
    reference: r.reference,
    status: r.status,
    companyName: r.company_name,
    contactName: r.contact_name,
    occupationSlugs: r.occupation_slugs,
    occupationOther: r.occupation_other,
    headcount: r.headcount,
    startAsap: r.start_asap,
    startDate: r.start_date,
    workCity: r.work_city,
    createdAt: r.created_at,
    assignedName: r.assigned?.display_name ?? null,
    phoneE164: r.phone_e164,
    email: r.email,
  };
}

export async function listStaffRequests(
  ctx: AdminContext,
  p: {
    tab: StaffRequestTab;
    q?: string;
    beroep?: OccupationSlug;
    periode?: 7 | 30 | 90;
    toegewezen?: string | "niemand";
    page: number;
  },
): Promise<{ rows: StaffRequestListRow[]; total: number; pageCount: number; tabCounts: Record<StaffRequestTab, number> }> {
  let query = ctx.supabase
    .from("staff_requests")
    .select(LIST_SELECT, { count: "exact" })
    .in("status", [...STAFF_REQUEST_TABS[p.tab]]);
  for (const term of searchTerms(p.q)) {
    if (term.kind === "phone") query = query.ilike("phone_e164", `%${term.value}%`);
    else {
      const w = term.value;
      query = query.or(
        `company_name.ilike.%${w}%,contact_name.ilike.%${w}%,email.ilike.%${w}%,reference.ilike.%${w}%,work_city.ilike.%${w}%`,
      );
    }
  }
  if (p.beroep) query = query.contains("occupation_slugs", [p.beroep]);
  if (p.periode) query = query.gte("created_at", new Date(Date.now() - p.periode * 86400000).toISOString());
  if (p.toegewezen === "niemand") query = query.is("assigned_to", null);
  else if (p.toegewezen) query = query.eq("assigned_to", p.toegewezen);

  const from = (p.page - 1) * PAGE_SIZE;
  const [list, statuses] = await Promise.all([
    query.order("created_at", { ascending: false }).range(from, from + PAGE_SIZE - 1),
    ctx.supabase.from("staff_requests").select("status"),
  ]);
  if (list.error) throw list.error;
  if (statuses.error) throw statuses.error;
  const rows = (list.data as unknown as Raw[]).map(toRow);
  const total = list.count ?? rows.length;
  return {
    rows,
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    tabCounts: countTabs((statuses.data ?? []).map((s) => s.status), STAFF_REQUEST_TABS),
  };
}

export async function getStaffRequest(ctx: AdminContext, reference: string): Promise<StaffRequestDetail | null> {
  const { data, error } = await ctx.supabase
    .from("staff_requests")
    .select(`${LIST_SELECT}, duration, hours_per_week, kvk_number, description, assigned_to`)
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const timeline = await listActivities(ctx, "staff_request", data.id);
  return {
    ...toRow(data as unknown as Raw),
    duration: data.duration,
    hoursPerWeek: data.hours_per_week,
    kvkNumber: data.kvk_number,
    description: data.description,
    assignedTo: data.assigned_to,
    timeline,
  };
}
