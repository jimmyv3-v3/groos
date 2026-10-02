/**
 * Vaste waardensets en termijnen (spec 10 §4.3, E-10-17). Client-veilig.
 * De enums staan ook in de database (supabase/migrations); de termijnen staan
 * ook in SQL (spec 10 §5.6). Wijzig ze altijd op beide plekken.
 */

export const OCCUPATION_SLUGS = [
  "glazenwasser",
  "schoonmaker",
  "logistiek-medewerker",
  "verhuizer",
  "hulpkracht-bouw-en-sloop",
] as const; // gelijk aan spec 00 §4.2
export type OccupationSlug = (typeof OCCUPATION_SLUGS)[number];

export const CONTRACT_TYPES = ["temp_agency", "secondment", "recruitment"] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];

/** id = waarde in de database, slug = waarde in de URL (filter `dienst`). */
export const SHIFTS = [
  { id: "early", slug: "vroeg" },
  { id: "day", slug: "dag" },
  { id: "evening", slug: "avond" },
  { id: "night", slug: "nacht" },
  { id: "weekend", slug: "weekend" },
] as const;
export type ShiftId = (typeof SHIFTS)[number]["id"];
export type ShiftSlug = (typeof SHIFTS)[number]["slug"];

/** Een vacature past bij een bucket als de bereiken overlappen. */
export const HOURS_BUCKETS = [
  { id: "tot-20", min: 1, max: 20 },
  { id: "20-32", min: 21, max: 31 },
  { id: "32-plus", min: 32, max: 60 },
] as const;
export type HoursBucketId = (typeof HOURS_BUCKETS)[number]["id"];

export const EDUCATION_LEVELS = ["none", "vmbo", "mbo1", "mbo2", "mbo3", "mbo4", "havo_vwo", "hbo", "wo"] as const;
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const EXPERIENCE_LEVELS = ["none", "nice_to_have", "required"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const QUALIFICATIONS = [
  "vca_basis",
  "vca_vol",
  "heftruck",
  "reachtruck",
  "ept",
  "ipaf",
  "vog",
  "rijbewijs_b",
  "rijbewijs_be",
  "rijbewijs_c",
  "code_95",
  "ras",
  "dav",
] as const;
export type Qualification = (typeof QUALIFICATIONS)[number];

export const MIN_AGE_REASONS = [
  "work_at_height",
  "construction_demolition",
  "forklift",
  "night_work",
  "hazardous_substances",
] as const;
export type MinAgeReason = (typeof MIN_AGE_REASONS)[number];

export const CLOSE_REASONS = ["filled", "expired", "withdrawn", "other"] as const;
export type CloseReason = (typeof CLOSE_REASONS)[number];

export const VACANCY_STATUSES = ["draft", "scheduled", "published", "closed", "archived"] as const;
export type VacancyStatus = (typeof VACANCY_STATUSES)[number];

export const APPLICATION_STATUSES = ["new", "in_progress", "invited", "placed", "rejected", "withdrawn"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_KINDS = ["vacancy", "registration"] as const;
export type ApplicationKind = (typeof APPLICATION_KINDS)[number];

export const APPLICATION_SOURCES = [
  "website",
  "whatsapp",
  "phone",
  "walk_in",
  "email",
  "referral",
  "job_board",
  "other",
] as const;
export type ApplicationSource = (typeof APPLICATION_SOURCES)[number];

export const STAFF_REQUEST_STATUSES = ["new", "in_progress", "quote_sent", "started", "completed", "cancelled"] as const;
export type StaffRequestStatus = (typeof STAFF_REQUEST_STATUSES)[number];

export const REQUEST_DURATIONS = ["one_day", "days", "weeks", "months", "indefinite", "unknown"] as const;
export type RequestDuration = (typeof REQUEST_DURATIONS)[number];

export const CONTACT_TOPICS = ["job_seeker", "employer", "callback", "other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const MESSAGE_STATUSES = ["new", "answered", "archived", "spam"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export const PROVINCES = [
  "Drenthe",
  "Flevoland",
  "Friesland",
  "Gelderland",
  "Groningen",
  "Limburg",
  "Noord-Brabant",
  "Noord-Holland",
  "Overijssel",
  "Utrecht",
  "Zeeland",
  "Zuid-Holland",
] as const;
export type Province = (typeof PROVINCES)[number];

export const CV_MAX_BYTES = 10 * 1024 * 1024;
export const CV_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;
export const PUBLIC_MEDIA_MAX_BYTES = 5 * 1024 * 1024;

// Termijnen: dezelfde waarden staan in SQL (spec 10 §5.6). Wijzig ze altijd op beide plekken.
export const VACANCY_DEFAULT_CLOSE_DAYS = 45; // B-15
export const VACANCY_EXTEND_DAYS = 30; // actie "verlengen" in spec 08
export const CLOSED_VISIBLE_DAYS = 30; // B-15
export const RETENTION_DAYS = {
  applicationDefault: 28,
  applicationConsent: 365,
  registration: 365,
  staleReminder: 56,
  staleAutoClose: 84,
  staffRequest: 730,
  contactMessage: 182,
  spam: 30,
  emailLog: 90,
  auditLog: 730,
  pendingUploadHours: 24,
} as const; // B-07
export const MINIMUM_WAGE_21_PLUS = 14.99; // per 1 juli 2026; jaarlijks bijwerken (waarschuwing in spec 08)
