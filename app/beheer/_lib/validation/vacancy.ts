import { z } from "zod";
import {
  CONTRACT_TYPES,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  MIN_AGE_REASONS,
  MINIMUM_WAGE_21_PLUS,
  OCCUPATION_SLUGS,
  PROVINCES,
  QUALIFICATIONS,
  SHIFTS,
  WORKPLACE_LANGUAGES,
  type VacancyStatus,
  type WorkplaceLanguage,
} from "@/lib/data/options";
import { formatEuro } from "@/lib/format";
import { S, fill } from "../../_strings";
import { amsterdamDateEndToIso, amsterdamDateKey } from "../format";
import type { PublishErrorCode } from "../types";

/**
 * Vacatureformulier (spec 08 §4.7, §5.5). De formulierwaarden zijn tekst,
 * zodat ze direct als defaultValue in de velden kunnen; het schema zet ze om
 * naar de kolommen van spec 10. Regels gelijk aan de checks van spec 10 §5.3.
 */
export type VacancyFormValues = {
  occupation_slug: string;
  title: string;
  city: string;
  postal_code: string;
  province: string;
  location_label: string;
  positions_count: string;
  summary: string;
  intro: string;
  tasks: string[];
  requirements: string[];
  offer: string[];
  extra: string;
  contract_type: string;
  hours_min: string;
  hours_max: string;
  shifts: string[];
  salary_min: string;
  salary_max: string;
  salary_note: string;
  start_asap: boolean;
  start_date: string;
  education_level: string;
  experience_level: string;
  experience_months: string;
  required_qualifications: string[];
  preferred_qualifications: string[];
  training_offered: string[];
  min_age_18: boolean;
  min_age_reason: string;
  workplace_language: string;
  contact_admin_id: string;
  closes_at: string;
  is_featured: boolean;
  is_urgent: boolean;
  allow_whatsapp_apply: boolean;
  seo_title: string;
  seo_description: string;
};

export const LIST_FIELDS = ["tasks", "requirements", "offer"] as const;
const ARRAY_FIELDS = [
  ...LIST_FIELDS,
  "shifts",
  "required_qualifications",
  "preferred_qualifications",
  "training_offered",
] as const;
const BOOL_FIELDS = ["start_asap", "min_age_18", "is_featured", "is_urgent", "allow_whatsapp_apply"] as const;

export function emptyVacancyValues(contactAdminId: string): VacancyFormValues {
  return {
    occupation_slug: "",
    title: "",
    city: "",
    postal_code: "",
    province: "Zuid-Holland",
    location_label: "",
    positions_count: "1",
    summary: "",
    intro: "",
    tasks: [],
    requirements: [],
    offer: [],
    extra: "",
    contract_type: "temp_agency",
    hours_min: "",
    hours_max: "",
    shifts: [],
    salary_min: "",
    salary_max: "",
    salary_note: "",
    start_asap: true,
    start_date: "",
    education_level: "none",
    experience_level: "none",
    experience_months: "",
    required_qualifications: [],
    preferred_qualifications: [],
    training_offered: [],
    min_age_18: false,
    min_age_reason: "",
    workplace_language: "",
    contact_admin_id: contactAdminId,
    closes_at: "",
    is_featured: false,
    is_urgent: false,
    allow_whatsapp_apply: true,
    seo_title: "",
    seo_description: "",
  };
}

/** Leest de formulierwaarden uit FormData (velden met dezelfde naam worden een lijst). */
export function vacancyValuesFromFormData(fd: FormData): VacancyFormValues {
  const base = emptyVacancyValues("");
  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(base) as (keyof VacancyFormValues)[]) {
    if ((ARRAY_FIELDS as readonly string[]).includes(key)) {
      out[key] = fd.getAll(key).map((v) => String(v));
    } else if ((BOOL_FIELDS as readonly string[]).includes(key)) {
      out[key] = fd.get(key) === "on" || fd.get(key) === "true";
    } else {
      const v = fd.get(key);
      out[key] = typeof v === "string" ? v : "";
    }
  }
  return out as VacancyFormValues;
}

/** "15,50" of "15.50" naar 15.5; leeg naar null; ongeldig naar NaN. */
export function parseEuro(value: string): number | null {
  const v = value.trim().replace(/^€\s*/, "");
  if (!v) return null;
  if (!/^\d{1,3}([.,]\d{1,2})?$/.test(v)) return Number.NaN;
  return Number(v.replace(",", "."));
}

function parseIntOrNull(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  return /^\d+$/.test(v) ? Number(v) : Number.NaN;
}

const cleanList = (items: string[]) => items.map((i) => i.trim()).filter(Boolean);
const nullIfEmpty = (v: string) => (v.trim() ? v.trim() : null);
const tooLong = (n: number) => fill(S.validation.tooLong, { aantal: n });

/** Kolommen voor save_vacancy (p_vacancy en p_nl). */
export type VacancyDbInput = {
  vacancy: {
    occupation_slug: string;
    city: string | null;
    postal_code: string | null;
    province: string;
    location_label: string | null;
    positions_count: number;
    contract_type: (typeof CONTRACT_TYPES)[number];
    hours_min: number | null;
    hours_max: number | null;
    shifts: string[];
    salary_min: number | null;
    salary_max: number | null;
    salary_note: string | null;
    education_level: string;
    experience_level: string;
    experience_months: number | null;
    required_qualifications: string[];
    preferred_qualifications: string[];
    training_offered: string[];
    min_age_18: boolean;
    min_age_reason: string | null;
    start_asap: boolean;
    start_date: string | null;
    workplace_language: WorkplaceLanguage | null;
    closes_at: string | null;
    is_featured: boolean;
    is_urgent: boolean;
    allow_whatsapp_apply: boolean;
    contact_admin_id: string | null;
  };
  nl: {
    title: string;
    summary: string | null;
    intro: string | null;
    tasks: string[];
    requirements: string[];
    offer: string[];
    extra: string | null;
    seo_title: string | null;
    seo_description: string | null;
  };
};

/**
 * Schema voor opslaan (ook als concept). Alles optioneel behalve beroep en
 * titel. status bepaalt of de sluitdatum leeg mag; contactIds zijn de actieve
 * beheerders met een telefoonnummer (B-48); storedClosesOn is de opgeslagen
 * sluitdatum als datum (Amsterdam), zodat een ongewijzigde sluitdatum van een
 * geplande of online vacature geen fout geeft (§4.7). Bij status closed is de
 * sluitdatum alleen-lezen en controleert het schema hem niet.
 */
export function vacancyDraftSchema(ctx: {
  status: VacancyStatus | null;
  contactIds: string[];
  storedClosesOn?: string | null;
  now?: Date;
}) {
  const today = amsterdamDateKey(ctx.now ?? new Date());
  const shiftIds = SHIFTS.map((s) => s.id) as string[];
  const quals = QUALIFICATIONS as readonly string[];

  const text = (max: number) => z.string().trim().max(max, tooLong(max));
  const list = z
    .array(z.string())
    .transform(cleanList)
    .pipe(z.array(z.string().max(200, S.validation.itemTooLong)).max(10, S.validation.listTooLong));

  return z
    .object({
      occupation_slug: z.enum(OCCUPATION_SLUGS, S.validation.occupationMissing),
      title: z.string().trim().min(2, S.validation.titleMissing).max(80, S.validation.titleTooLong),
      city: z
        .string()
        .trim()
        .max(80, tooLong(80))
        .refine((v) => v.length !== 1, S.validation.cityMissing),
      postal_code: z
        .string()
        .trim()
        .toUpperCase()
        .refine((v) => !v || /^[1-9][0-9]{3} ?[A-Z]{2}$/.test(v), S.validation.postalCode),
      province: z.enum(PROVINCES).catch("Zuid-Holland"),
      location_label: text(60),
      positions_count: z.string().refine((v) => {
        const n = parseIntOrNull(v);
        return n === null || (n >= 1 && n <= 99);
      }, S.validation.positions),
      summary: text(200),
      intro: text(1200),
      tasks: list,
      requirements: list,
      offer: list,
      extra: text(1200),
      contract_type: z.enum(CONTRACT_TYPES).catch("temp_agency"),
      hours_min: z.string(),
      hours_max: z.string(),
      shifts: z.array(z.string()).transform((v) => v.filter((s) => shiftIds.includes(s))),
      salary_min: z.string(),
      salary_max: z.string(),
      salary_note: text(200),
      start_asap: z.boolean(),
      start_date: z.string().trim(),
      education_level: z.enum(EDUCATION_LEVELS).catch("none"),
      experience_level: z.enum(EXPERIENCE_LEVELS).catch("none"),
      experience_months: z.string(),
      required_qualifications: z.array(z.string()).transform((v) => v.filter((q) => quals.includes(q))),
      preferred_qualifications: z.array(z.string()).transform((v) => v.filter((q) => quals.includes(q))),
      training_offered: z.array(z.string()).transform((v) => v.filter((q) => quals.includes(q))),
      min_age_18: z.boolean(),
      min_age_reason: z.string(),
      // Mag leeg blijven; niet nodig om te publiceren (spec 10 kruiscontrole_1).
      workplace_language: z.union([z.literal(""), z.enum(WORKPLACE_LANGUAGES)]).catch(""),
      contact_admin_id: z.string().trim(),
      closes_at: z.string().trim(),
      is_featured: z.boolean(),
      is_urgent: z.boolean(),
      allow_whatsapp_apply: z.boolean(),
      seo_title: text(60),
      seo_description: text(160),
    })
    .superRefine((v, issue) => {
      const add = (path: string, message: string) => issue.addIssue({ code: "custom", path: [path], message });

      const hMin = parseIntOrNull(v.hours_min);
      const hMax = parseIntOrNull(v.hours_max);
      for (const [key, n] of [["hours_min", hMin], ["hours_max", hMax]] as const) {
        if (n !== null && (Number.isNaN(n) || n < 1 || n > 60)) add(key, S.validation.hoursRange);
      }
      if (hMin !== null && hMax !== null && hMin > hMax) add("hours_min", S.validation.hoursOrder);

      const sMin = parseEuro(v.salary_min);
      const sMax = parseEuro(v.salary_max);
      for (const [key, n] of [["salary_min", sMin], ["salary_max", sMax]] as const) {
        if (n !== null && (Number.isNaN(n) || n < 5 || n > 100)) add(key, S.validation.salaryRange);
      }
      if (sMin !== null && sMax !== null && sMin > sMax) add("salary_min", S.validation.salaryOrder);

      if (v.experience_level === "required") {
        const m = parseIntOrNull(v.experience_months);
        if (m !== null && (Number.isNaN(m) || m < 1 || m > 120)) add("experience_months", S.validation.experienceMonths);
      }
      if (v.required_qualifications.some((q) => v.preferred_qualifications.includes(q))) {
        add("preferred_qualifications", S.validation.qualificationsOverlap);
      }
      if (v.min_age_18 && !(MIN_AGE_REASONS as readonly string[]).includes(v.min_age_reason)) {
        add("min_age_reason", S.validation.minAgeReason);
      }
      if (!v.start_asap && !/^\d{4}-\d{2}-\d{2}$/.test(v.start_date)) add("start_date", S.validation.startDate);

      if (ctx.status !== "closed") {
        const keepsStored =
          (ctx.status === "scheduled" || ctx.status === "published") && v.closes_at === (ctx.storedClosesOn ?? "");
        if (v.closes_at) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(v.closes_at) || (v.closes_at <= today && !keepsStored)) {
            add("closes_at", S.validation.closesInPast);
          }
        } else if (ctx.status && ctx.status !== "draft") {
          add("closes_at", S.validation.closesRequired);
        }
      }
      if (v.contact_admin_id && !ctx.contactIds.includes(v.contact_admin_id)) add("contact_admin_id", S.validation.contact);
    })
    .transform(
      (v): VacancyDbInput => ({
        vacancy: {
          occupation_slug: v.occupation_slug,
          city: nullIfEmpty(v.city),
          postal_code: v.postal_code ? v.postal_code.replace(/^(\d{4}) ?([A-Z]{2})$/, "$1 $2") : null,
          province: v.province,
          location_label: nullIfEmpty(v.location_label),
          positions_count: parseIntOrNull(v.positions_count) ?? 1,
          contract_type: v.contract_type,
          hours_min: parseIntOrNull(v.hours_min),
          hours_max: parseIntOrNull(v.hours_max),
          shifts: v.shifts,
          salary_min: parseEuro(v.salary_min),
          salary_max: parseEuro(v.salary_max),
          salary_note: nullIfEmpty(v.salary_note),
          education_level: v.education_level,
          experience_level: v.experience_level,
          experience_months: v.experience_level === "required" ? parseIntOrNull(v.experience_months) : null,
          required_qualifications: v.required_qualifications,
          preferred_qualifications: v.preferred_qualifications,
          training_offered: v.training_offered,
          min_age_18: v.min_age_18,
          min_age_reason: v.min_age_18 ? v.min_age_reason : null,
          start_asap: v.start_asap,
          start_date: v.start_asap ? null : v.start_date || null,
          workplace_language: v.workplace_language || null,
          closes_at: v.closes_at ? amsterdamDateEndToIso(v.closes_at) : null,
          is_featured: v.is_featured,
          is_urgent: v.is_urgent,
          allow_whatsapp_apply: v.allow_whatsapp_apply,
          contact_admin_id: v.contact_admin_id || null,
        },
        nl: {
          title: v.title,
          summary: nullIfEmpty(v.summary),
          intro: nullIfEmpty(v.intro),
          tasks: v.tasks,
          requirements: v.requirements,
          offer: v.offer,
          extra: nullIfEmpty(v.extra),
          seo_title: nullIfEmpty(v.seo_title),
          seo_description: nullIfEmpty(v.seo_description),
        },
      }),
    );
}

/**
 * Dezelfde regels als vacancy_publish_errors, voor directe feedback. Met
 * contactIds (actieve beheerders met telefoonnummer) telt een contactpersoon
 * zonder telefoonnummer ook als ontbrekend (B-48).
 */
export function publishErrorsFromValues(v: VacancyFormValues, contactIds?: readonly string[]): PublishErrorCode[] {
  const errors: PublishErrorCode[] = [];
  if (!v.title.trim()) errors.push("title");
  if (!v.city.trim()) errors.push("city");
  if (!v.hours_min.trim() || !v.hours_max.trim()) errors.push("hours");
  if (!v.salary_min.trim() || !v.salary_max.trim()) errors.push("salary");
  if (v.intro.trim().length < 20) errors.push("intro");
  if (cleanList(v.tasks).length < 3) errors.push("tasks");
  if (cleanList(v.requirements).length < 1) errors.push("requirements");
  if (cleanList(v.offer).length < 1) errors.push("offer");
  if (!v.start_asap && !v.start_date) errors.push("start");
  if (!v.contact_admin_id || (contactIds && !contactIds.includes(v.contact_admin_id))) errors.push("contact");
  return errors;
}

/**
 * Waarschuwingen zonder blokkade (§5.5): uurloon onder het minimumloon (B-42,
 * VR-07) en Geen ervaring nodig bij werken op hoogte zonder training.
 */
export function vacancyWarnings(
  v: Pick<VacancyFormValues, "salary_min" | "experience_level" | "min_age_18" | "min_age_reason" | "training_offered">,
): string[] {
  const warnings: string[] = [];
  const min = parseEuro(v.salary_min);
  if (min !== null && !Number.isNaN(min) && min < MINIMUM_WAGE_21_PLUS) {
    warnings.push(fill(S.validation.belowMinimumWage, { bedrag: formatEuro(MINIMUM_WAGE_21_PLUS, "nl") }));
  }
  if (
    v.experience_level === "none" &&
    v.min_age_18 &&
    v.min_age_reason === "work_at_height" &&
    v.training_offered.length === 0
  ) {
    warnings.push(S.validation.noExperienceAtHeight);
  }
  return warnings;
}

/** Bedrag uit de database als tekst voor het formulier: 15.5 -> "15,50". */
export function euroToInput(value: number | null): string {
  return value === null ? "" : value.toFixed(2).replace(".", ",");
}
