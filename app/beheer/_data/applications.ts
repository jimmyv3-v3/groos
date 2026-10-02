import "server-only";
import type { ApplicationSource, ApplicationStatus, OccupationSlug } from "@/lib/data/options";
import type { AdminContext } from "../_lib/auth";
import { searchTerms } from "../_lib/search";
import { APPLICATION_TABS, countTabs } from "../_lib/status";
import type { ActivityItem, ApplicationTab } from "../_lib/types";
import { listActivities } from "./activities";
import { PAGE_SIZE } from "./vacancies";

export type ApplicationListRow = {
  id: string;
  reference: string;
  kind: "vacancy" | "registration";
  status: ApplicationStatus;
  fullName: string;
  firstName: string;
  phoneE164: string | null;
  email: string | null;
  city: string | null;
  createdAt: string;
  hasCv: boolean;
  retainUntil: string;
  vacancyNumber: number | null;
  vacancyTitle: string | null;
  assignedName: string | null;
};

export type ApplicationDetail = ApplicationListRow & {
  source: ApplicationSource;
  mayWorkInNl: boolean | null;
  availableFrom: string | null;
  hasDrivingLicenseB: boolean | null;
  occupationSlugs: string[];
  message: string | null;
  locale: "nl" | "en";
  retentionConsent: boolean;
  retentionConsentAt: string | null;
  cvFilename: string | null;
  cvMime: string | null;
  cvSize: number | null;
  assignedTo: string | null;
  timeline: ActivityItem[];
  others: ApplicationListRow[];
};

const LIST_SELECT =
  "id, reference, kind, status, source, first_name, last_name, phone_e164, email, city, created_at, cv_path, retain_until, vacancy_number, vacancy_title_snapshot, occupation_slugs, assigned:admin_profiles!assigned_to(display_name)";

type ListRowRaw = {
  id: string;
  reference: string;
  kind: "vacancy" | "registration";
  status: ApplicationStatus;
  first_name: string | null;
  last_name: string | null;
  phone_e164: string | null;
  email: string | null;
  city: string | null;
  created_at: string;
  cv_path: string | null;
  retain_until: string;
  vacancy_number: number | null;
  vacancy_title_snapshot: string | null;
  assigned: { display_name: string } | null;
};

function toRow(a: ListRowRaw): ApplicationListRow {
  return {
    id: a.id,
    reference: a.reference,
    kind: a.kind,
    status: a.status,
    fullName: [a.first_name, a.last_name].filter(Boolean).join(" ") || a.reference,
    firstName: a.first_name ?? "",
    phoneE164: a.phone_e164,
    email: a.email,
    city: a.city,
    createdAt: a.created_at,
    hasCv: Boolean(a.cv_path),
    retainUntil: a.retain_until,
    vacancyNumber: a.vacancy_number,
    vacancyTitle: a.vacancy_title_snapshot,
    assignedName: a.assigned?.display_name ?? null,
  };
}

export async function listApplications(
  ctx: AdminContext,
  p: {
    tab: ApplicationTab;
    q?: string;
    vacature?: number | "inschrijving";
    beroep?: OccupationSlug;
    cv?: "met" | "zonder";
    periode?: 7 | 30 | 90;
    toegewezen?: string | "niemand";
    page: number;
  },
): Promise<{ rows: ApplicationListRow[]; total: number; pageCount: number; tabCounts: Record<ApplicationTab, number> }> {
  let query = ctx.supabase
    .from("applications")
    .select(LIST_SELECT, { count: "exact" })
    .is("anonymized_at", null)
    .in("status", [...APPLICATION_TABS[p.tab]]);

  for (const term of searchTerms(p.q)) {
    if (term.kind === "phone") {
      query = query.ilike("phone_e164", `%${term.value}%`);
    } else {
      const w = term.value;
      query = query.or(
        `first_name.ilike.%${w}%,last_name.ilike.%${w}%,email.ilike.%${w}%,reference.ilike.%${w}%,city.ilike.%${w}%`,
      );
    }
  }
  if (p.vacature === "inschrijving") query = query.eq("kind", "registration");
  else if (typeof p.vacature === "number") query = query.eq("vacancy_number", p.vacature);
  if (p.beroep) query = query.contains("occupation_slugs", [p.beroep]);
  if (p.cv === "met") query = query.not("cv_path", "is", null);
  if (p.cv === "zonder") query = query.is("cv_path", null);
  if (p.periode) query = query.gte("created_at", new Date(Date.now() - p.periode * 86400000).toISOString());
  if (p.toegewezen === "niemand") query = query.is("assigned_to", null);
  else if (p.toegewezen) query = query.eq("assigned_to", p.toegewezen);

  const from = (p.page - 1) * PAGE_SIZE;
  const [list, statuses] = await Promise.all([
    query.order("created_at", { ascending: false }).range(from, from + PAGE_SIZE - 1),
    ctx.supabase.from("applications").select("status").is("anonymized_at", null),
  ]);
  if (list.error) throw list.error;
  if (statuses.error) throw statuses.error;
  const rows = (list.data as unknown as ListRowRaw[]).map(toRow);
  const total = list.count ?? rows.length;
  return {
    rows,
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    tabCounts: countTabs((statuses.data ?? []).map((s) => s.status), APPLICATION_TABS),
  };
}

export async function getApplication(ctx: AdminContext, reference: string): Promise<ApplicationDetail | null> {
  const { data, error } = await ctx.supabase
    .from("applications")
    .select(
      `${LIST_SELECT}, may_work_in_nl, available_from, has_driving_license_b, message, locale, retention_consent, retention_consent_at, cv_filename, cv_mime, cv_size, assigned_to, anonymized_at`,
    )
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw error;
  if (!data || data.anonymized_at) return null;

  const contactFilters = [
    data.email ? `email.eq.${data.email.replace(/[,()]/g, "")}` : null,
    data.phone_e164 ? `phone_e164.eq.${data.phone_e164.replace(/[,()]/g, "")}` : null,
  ].filter(Boolean);

  const [timeline, others] = await Promise.all([
    listActivities(ctx, "application", data.id),
    contactFilters.length
      ? ctx.supabase
          .from("applications")
          .select(LIST_SELECT)
          .is("anonymized_at", null)
          .neq("id", data.id)
          .or(contactFilters.join(","))
          .order("created_at", { ascending: false })
          .limit(10)
      : null,
  ]);
  if (others?.error) throw others.error;

  return {
    ...toRow(data as unknown as ListRowRaw),
    source: data.source,
    mayWorkInNl: data.may_work_in_nl,
    availableFrom: data.available_from,
    hasDrivingLicenseB: data.has_driving_license_b,
    occupationSlugs: data.occupation_slugs,
    message: data.message,
    locale: data.locale,
    retentionConsent: data.retention_consent,
    retentionConsentAt: data.retention_consent_at,
    cvFilename: data.cv_filename,
    cvMime: data.cv_mime,
    cvSize: data.cv_size,
    assignedTo: data.assigned_to,
    timeline,
    others: ((others?.data ?? []) as unknown as ListRowRaw[]).map(toRow),
  };
}
