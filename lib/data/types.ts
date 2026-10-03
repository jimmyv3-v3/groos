/**
 * Domeintypen van de leesfuncties in lib/data (spec 10 §4.3). Alles is
 * JSON-serialiseerbaar: datums als ISO-string, bedragen als number.
 */
import type {
  CloseReason,
  ContractType,
  EducationLevel,
  ExperienceLevel,
  HoursBucketId,
  MinAgeReason,
  OccupationSlug,
  Province,
  Qualification,
  ShiftId,
  ShiftSlug,
  WorkplaceLanguage,
} from "./options";

export type VacancyState = "open" | "closed";

export type VacancyOccupation = {
  slug: OccupationSlug;
  nameNl: string;
  pluralNl: string;
  nameEn: string;
  pluralEn: string;
};

export type VacancyListItem = {
  id: string;
  number: number;
  slug: string;
  /** Pad zonder taalprefix, voor Link uit @/i18n/navigation. */
  path: `/vacatures/${string}`;
  title: string;
  /** Valt terug op de eerste zinnen van intro (maximaal 200 tekens). */
  summary: string;
  occupation: VacancyOccupation;
  city: string;
  citySlug: string;
  locationLabel: string | null;
  contractType: ContractType;
  hoursMin: number;
  hoursMax: number;
  shifts: ShiftId[];
  /** Bruto per uur in euro. */
  salaryMin: number;
  salaryMax: number;
  isFeatured: boolean;
  isUrgent: boolean;
  startAsap: boolean;
  /** "YYYY-MM-DD" */
  startDate: string | null;
  publishedAt: string;
  closesAt: string;
  state: VacancyState;
};

export type VacancyContact = {
  name: string;
  phoneE164: string | null;
  whatsappE164: string | null;
  photoUrl: string | null;
};

export type VacancyDetail = VacancyListItem & {
  intro: string;
  tasks: string[];
  requirements: string[];
  offer: string[];
  extra: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  postalCode: string | null;
  province: Province;
  positionsCount: number;
  salaryNote: string | null;
  educationLevel: EducationLevel;
  experienceLevel: ExperienceLevel;
  experienceMonths: number | null;
  requiredQualifications: Qualification[];
  preferredQualifications: Qualification[];
  trainingOffered: Qualification[];
  minAge18: boolean;
  minAgeReason: MinAgeReason | null;
  workplaceLanguage: WorkplaceLanguage | null;
  allowWhatsappApply: boolean;
  /** rijbewijs_b in vereist of pré (B-17). */
  asksDrivingLicenseB: boolean;
  imageUrl: string | null;
  contact: VacancyContact | null;
  /** Alleen bij state "closed". */
  closedAt: string | null;
  closeReason: CloseReason | null;
  updatedAt: string;
};

export type VacancyFilters = {
  /** Maximaal 80 tekens; zoekt in titel, plaats, beroep, samenvatting, intro en taken. */
  q?: string;
  beroep?: OccupationSlug[];
  /** citySlug, bijvoorbeeld "den-haag". */
  plaats?: string[];
  uren?: HoursBucketId[];
  dienst?: ShiftSlug[];
};

export type VacancySort = "newest" | "salary" | "closing";

export type VacancyListResult = {
  items: VacancyListItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  /** page > pageCount en pageCount > 0: spec 06 roept notFound() aan. */
  outOfRange: boolean;
};

export type VacancyFacets = {
  total: number;
  /** Volgorde: occupations.sort_order. */
  beroep: { slug: OccupationSlug; nameNl: string; count: number }[];
  /** Alleen plaatsen met open vacatures, aflopend op aantal. */
  plaats: { slug: string; name: string; count: number }[];
  uren: { id: HoursBucketId; count: number }[];
  dienst: { slug: ShiftSlug; count: number }[];
};

export type OccupationWithCount = VacancyOccupation & { sortOrder: number; openCount: number };
