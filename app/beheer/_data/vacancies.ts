import "server-only";
import { CLOSED_VISIBLE_DAYS, type CloseReason, type OccupationSlug, type VacancyStatus } from "@/lib/data/options";
import type { VacancyDetail } from "@/lib/data/types";
import { publicMediaUrl } from "@/lib/supabase/public-media";
import type { AdminContext } from "../_lib/auth";
import { isoToAmsterdamLocal } from "../_lib/format";
import { countTabs, VACANCY_TABS } from "../_lib/status";
import { isPublishErrorCode, type ActivityItem, type PublishErrorCode, type VacancyTab } from "../_lib/types";
import { euroToInput, type VacancyFormValues } from "../_lib/validation/vacancy";
import { listActivities } from "./activities";

export const PAGE_SIZE = 25;

export type VacancyListRow = {
  id: string;
  number: number;
  status: VacancyStatus;
  title: string;
  slug: string;
  occupationSlug: OccupationSlug;
  city: string | null;
  publishedAt: string | null;
  publishAt: string | null;
  closesAt: string | null;
  closeReason: CloseReason | null;
  isFeatured: boolean;
  isUrgent: boolean;
  contactName: string | null;
  applicationCount: number;
  updatedAt: string;
  publicState: "open" | "closed" | null;
};

/** Zelfde regels als vacancy_public_state in SQL (spec 10 §5.4). */
export function publicStateOf(
  v: { status: VacancyStatus; publish_at: string | null; closes_at: string | null; closed_at: string | null },
  now = Date.now(),
): "open" | "closed" | null {
  const closes = v.closes_at ? Date.parse(v.closes_at) : null;
  const visible = CLOSED_VISIBLE_DAYS * 24 * 60 * 60 * 1000;
  const publishOk = v.publish_at ? Date.parse(v.publish_at) <= now : true;
  if ((v.status === "published" || (v.status === "scheduled" && v.publish_at)) && publishOk && closes && closes > now) {
    return "open";
  }
  if (v.status === "published" && closes && closes <= now && closes > now - visible) return "closed";
  if (v.status === "closed" && v.closed_at && Date.parse(v.closed_at) > now - visible) return "closed";
  return null;
}

type ListParams = {
  tab: VacancyTab;
  q?: string;
  beroep?: OccupationSlug;
  contact?: string;
  vlag?: "uitgelicht" | "spoed";
  sortering: "bewerkt" | "sluitdatum" | "nummer";
  page: number;
};

export async function listVacancies(
  ctx: AdminContext,
  p: ListParams,
): Promise<{ rows: VacancyListRow[]; total: number; pageCount: number; tabCounts: Record<VacancyTab, number> }> {
  let query = ctx.supabase
    .from("vacancies")
    .select(
      "id, number, status, occupation_slug, city, published_at, publish_at, closes_at, closed_at, close_reason, is_featured, is_urgent, updated_at, contact:admin_profiles!contact_admin_id(display_name), nl:vacancy_translations!inner(title, slug), applications(count)",
      { count: "exact" },
    )
    .eq("vacancy_translations.locale", "nl")
    .in("status", [...VACANCY_TABS[p.tab]]);

  const q = p.q?.trim().slice(0, 80);
  if (q) {
    if (/^\d+$/.test(q)) {
      query = query.eq("number", Number(q));
    } else {
      for (const word of q.toLowerCase().replace(/[,()*%\\:"']/g, " ").split(/\s+/).filter(Boolean).slice(0, 3)) {
        query = query.ilike("vacancy_translations.title", `%${word}%`);
      }
    }
  }
  if (p.beroep) query = query.eq("occupation_slug", p.beroep);
  if (p.contact) query = query.eq("contact_admin_id", p.contact);
  if (p.vlag === "uitgelicht") query = query.eq("is_featured", true);
  if (p.vlag === "spoed") query = query.eq("is_urgent", true);

  if (p.sortering === "sluitdatum") query = query.order("closes_at", { ascending: true, nullsFirst: false });
  else if (p.sortering === "nummer") query = query.order("number", { ascending: false });
  else query = query.order("updated_at", { ascending: false });

  const from = (p.page - 1) * PAGE_SIZE;
  const [list, statuses] = await Promise.all([
    query.range(from, from + PAGE_SIZE - 1),
    ctx.supabase.from("vacancies").select("status"),
  ]);
  if (list.error) throw list.error;
  if (statuses.error) throw statuses.error;

  const now = Date.now();
  const rows: VacancyListRow[] = (list.data ?? []).map((v) => ({
    id: v.id,
    number: v.number,
    status: v.status,
    title: v.nl[0]?.title ?? "",
    slug: v.nl[0]?.slug ?? "",
    occupationSlug: v.occupation_slug as OccupationSlug,
    city: v.city,
    publishedAt: v.published_at,
    publishAt: v.publish_at,
    closesAt: v.closes_at,
    closeReason: v.close_reason,
    isFeatured: v.is_featured,
    isUrgent: v.is_urgent,
    contactName: v.contact?.display_name ?? null,
    applicationCount: v.applications[0]?.count ?? 0,
    updatedAt: v.updated_at,
    publicState: publicStateOf(v, now),
  }));
  const total = list.count ?? rows.length;
  return {
    rows,
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    tabCounts: countTabs((statuses.data ?? []).map((s) => s.status), VACANCY_TABS),
  };
}

const EDIT_SELECT =
  "*, nl:vacancy_translations!inner(title, slug, summary, intro, tasks, requirements, offer, extra, seo_title, seo_description), occupation:occupations(slug, name_nl, plural_nl, name_en, plural_en), contact:admin_profiles!contact_admin_id(display_name, phone_e164, whatsapp_e164, photo_path, is_active)";

async function loadVacancy(ctx: AdminContext, number: number) {
  const { data, error } = await ctx.supabase
    .from("vacancies")
    .select(EDIT_SELECT)
    .eq("number", number)
    .eq("vacancy_translations.locale", "nl")
    .maybeSingle();
  if (error) throw error;
  return data;
}

type LoadedVacancy = NonNullable<Awaited<ReturnType<typeof loadVacancy>>>;

export type VacancyForEdit = {
  id: string;
  number: number;
  form: VacancyFormValues;
  status: VacancyStatus;
  publishErrors: PublishErrorCode[];
  updatedAt: string;
  applicationCount: number;
  openApplicationCount: number;
  history: ActivityItem[];
  slug: string;
  title: string;
  city: string | null;
  publishAt: string | null;
  closesAt: string | null;
  closeReason: CloseReason | null;
  isFeatured: boolean;
  isUrgent: boolean;
  publicState: "open" | "closed" | null;
};

function formValuesOf(v: LoadedVacancy): VacancyFormValues {
  const t = v.nl[0];
  return {
    occupation_slug: v.occupation_slug,
    title: t?.title ?? "",
    city: v.city ?? "",
    postal_code: v.postal_code ?? "",
    province: v.province,
    location_label: v.location_label ?? "",
    positions_count: String(v.positions_count),
    summary: t?.summary ?? "",
    intro: t?.intro ?? "",
    tasks: t?.tasks ?? [],
    requirements: t?.requirements ?? [],
    offer: t?.offer ?? [],
    extra: t?.extra ?? "",
    contract_type: v.contract_type,
    hours_min: v.hours_min === null ? "" : String(v.hours_min),
    hours_max: v.hours_max === null ? "" : String(v.hours_max),
    shifts: v.shifts,
    salary_min: euroToInput(v.salary_min),
    salary_max: euroToInput(v.salary_max),
    salary_note: v.salary_note ?? "",
    start_asap: v.start_asap,
    start_date: v.start_date ?? "",
    education_level: v.education_level,
    experience_level: v.experience_level,
    experience_months: v.experience_months === null ? "" : String(v.experience_months),
    required_qualifications: v.required_qualifications,
    preferred_qualifications: v.preferred_qualifications,
    training_offered: v.training_offered,
    min_age_18: v.min_age_18,
    min_age_reason: v.min_age_reason ?? "",
    // Zonder migratie kruiscontrole_1 ontbreekt de kolom; dan leeg.
    workplace_language: v.workplace_language ?? "",
    contact_admin_id: v.contact_admin_id ?? "",
    closes_at: v.closes_at ? isoToAmsterdamLocal(v.closes_at).slice(0, 10) : "",
    is_featured: v.is_featured,
    is_urgent: v.is_urgent,
    allow_whatsapp_apply: v.allow_whatsapp_apply,
    seo_title: t?.seo_title ?? "",
    seo_description: t?.seo_description ?? "",
  };
}

export async function getVacancyForEdit(ctx: AdminContext, number: number): Promise<VacancyForEdit | null> {
  const v = await loadVacancy(ctx, number);
  if (!v) return null;
  const [errors, apps, openApps, history] = await Promise.all([
    ctx.supabase.rpc("vacancy_publish_errors", { p_vacancy_id: v.id }),
    ctx.supabase.from("applications").select("id", { count: "exact", head: true }).eq("vacancy_id", v.id),
    ctx.supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("vacancy_id", v.id)
      .in("status", ["new", "in_progress", "invited"])
      .is("anonymized_at", null),
    listActivities(ctx, "vacancy", v.id, 10),
  ]);
  if (errors.error) throw errors.error;
  return {
    id: v.id,
    number: v.number,
    form: formValuesOf(v),
    status: v.status,
    publishErrors: (errors.data ?? []).filter(isPublishErrorCode),
    updatedAt: v.updated_at,
    applicationCount: apps.count ?? 0,
    openApplicationCount: openApps.count ?? 0,
    history,
    slug: v.nl[0]?.slug ?? "",
    title: v.nl[0]?.title ?? "",
    city: v.city,
    publishAt: v.publish_at,
    closesAt: v.closes_at,
    closeReason: v.close_reason,
    isFeatured: v.is_featured,
    isUrgent: v.is_urgent,
    publicState: publicStateOf(v),
  };
}

/** Vacature als VacancyDetail (spec 10), ook voor concepten. */
export async function getVacancyPreview(ctx: AdminContext, number: number): Promise<VacancyDetail | null> {
  const v = await loadVacancy(ctx, number);
  if (!v) return null;
  const t = v.nl[0];
  const occ = v.occupation;
  const intro = t?.intro ?? "";
  const state = publicStateOf(v);
  return {
    id: v.id,
    number: v.number,
    slug: t?.slug ?? "",
    path: `/vacatures/${t?.slug ?? ""}`,
    title: t?.title ?? "",
    summary: t?.summary ?? intro.slice(0, 200),
    occupation: {
      slug: v.occupation_slug as OccupationSlug,
      nameNl: occ?.name_nl ?? v.occupation_slug,
      pluralNl: occ?.plural_nl ?? v.occupation_slug,
      nameEn: occ?.name_en ?? v.occupation_slug,
      pluralEn: occ?.plural_en ?? v.occupation_slug,
    },
    city: v.city ?? "",
    citySlug: v.city_slug ?? "",
    locationLabel: v.location_label,
    contractType: v.contract_type,
    hoursMin: v.hours_min ?? 0,
    hoursMax: v.hours_max ?? 0,
    shifts: v.shifts,
    salaryMin: v.salary_min ?? 0,
    salaryMax: v.salary_max ?? 0,
    isFeatured: v.is_featured,
    isUrgent: v.is_urgent,
    publishedAt: v.published_at ?? v.updated_at,
    closesAt: v.closes_at ?? "",
    state: state ?? "open",
    intro,
    tasks: t?.tasks ?? [],
    requirements: t?.requirements ?? [],
    offer: t?.offer ?? [],
    extra: t?.extra ?? null,
    seoTitle: t?.seo_title ?? null,
    seoDescription: t?.seo_description ?? null,
    postalCode: v.postal_code,
    province: v.province as VacancyDetail["province"],
    positionsCount: v.positions_count,
    salaryNote: v.salary_note,
    educationLevel: v.education_level,
    experienceLevel: v.experience_level,
    experienceMonths: v.experience_months,
    requiredQualifications: v.required_qualifications as VacancyDetail["requiredQualifications"],
    preferredQualifications: v.preferred_qualifications as VacancyDetail["preferredQualifications"],
    trainingOffered: v.training_offered as VacancyDetail["trainingOffered"],
    minAge18: v.min_age_18,
    minAgeReason: v.min_age_reason,
    workplaceLanguage: v.workplace_language ?? null,
    startAsap: v.start_asap,
    startDate: v.start_date,
    allowWhatsappApply: v.allow_whatsapp_apply,
    asksDrivingLicenseB:
      v.required_qualifications.includes("rijbewijs_b") || v.preferred_qualifications.includes("rijbewijs_b"),
    imageUrl: publicMediaUrl(v.image_path),
    contact: v.contact
      ? {
          name: v.contact.display_name,
          phoneE164: v.contact.phone_e164,
          whatsappE164: v.contact.whatsapp_e164,
          photoUrl: publicMediaUrl(v.contact.photo_path),
        }
      : null,
    closedAt: v.closed_at,
    closeReason: v.close_reason,
    updatedAt: v.updated_at,
  };
}

/** Status van een vacature voor de voorbeeldbalk. */
export async function getVacancyStatus(ctx: AdminContext, number: number): Promise<VacancyStatus | null> {
  const { data, error } = await ctx.supabase.from("vacancies").select("status").eq("number", number).maybeSingle();
  if (error) throw error;
  return data?.status ?? null;
}

export async function listOccupationOptions(
  ctx: AdminContext,
): Promise<{ slug: OccupationSlug; nameNl: string; pluralNl: string }[]> {
  const { data, error } = await ctx.supabase
    .from("occupations")
    .select("slug, name_nl, plural_nl")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((o) => ({ slug: o.slug as OccupationSlug, nameNl: o.name_nl, pluralNl: o.plural_nl }));
}

/** Vacatures voor het filter in de sollicitatielijst (zonder archief, nieuwste eerst). */
export async function listVacancyOptions(ctx: AdminContext): Promise<{ number: number; title: string }[]> {
  const { data, error } = await ctx.supabase
    .from("vacancies")
    .select("number, nl:vacancy_translations!inner(title)")
    .eq("vacancy_translations.locale", "nl")
    .neq("status", "archived")
    .order("number", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []).map((v) => ({ number: v.number, title: v.nl[0]?.title ?? "" }));
}

export async function listAdminOptions(ctx: AdminContext): Promise<{ id: string; displayName: string }[]> {
  const { data, error } = await ctx.supabase
    .from("admin_profiles")
    .select("id, display_name")
    .eq("is_active", true)
    .order("display_name");
  if (error) throw error;
  return (data ?? []).map((a) => ({ id: a.id, displayName: a.display_name }));
}
