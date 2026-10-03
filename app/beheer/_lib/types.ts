/** Gedeelde typen van Groos Beheer (spec 08 §4.3, §5.2). Client-veilig. */
import type { Enums } from "@/lib/database.types";
import type { CloseReason, OccupationSlug, VacancyStatus } from "@/lib/data/options";

export type AdminRole = Enums<"admin_role">;
export type EntityType = Enums<"entity_type">;
export type ActivityKind = Enums<"activity_kind">;

export type NavCounts = { applicationsNew: number; requestsNew: number; messagesNew: number };

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  actorName: string | null;
  body: string | null;
  payload: Record<string, unknown> | null;
  createdAt: string;
  entity?: { label: string; href: string };
};

export type BadgeTone = "neutral" | "brand" | "info" | "success" | "warning" | "danger";

export type TodoItem = { id: string; text: string; href: string; tone?: BadgeTone; extendId?: string };

export const PUBLISH_ERROR_CODES = [
  "title",
  "city",
  "hours",
  "salary",
  "intro",
  "tasks",
  "requirements",
  "offer",
  "start",
  "contact",
  "publish_at",
] as const;
export type PublishErrorCode = (typeof PUBLISH_ERROR_CODES)[number];

export function isPublishErrorCode(value: string): value is PublishErrorCode {
  return (PUBLISH_ERROR_CODES as readonly string[]).includes(value);
}

export type VacancyActionKey =
  | "edit"
  | "preview"
  | "viewOnSite"
  | "copyLink"
  | "shareWhatsapp"
  | "publish"
  | "publishNow"
  | "schedule"
  | "reschedule"
  | "unschedule"
  | "extend"
  | "closeFilled"
  | "close"
  | "takeOffline"
  | "feature"
  | "urgent"
  | "reopen"
  | "archive"
  | "restore"
  | "duplicate"
  | "delete"
  | "viewApplications";

/** Wat VacancyActions en VacancyDialogs van een vacature nodig hebben. */
export type VacancyActionTarget = {
  id: string;
  number: number;
  title: string;
  city: string | null;
  slug: string;
  status: VacancyStatus;
  closesAt: string | null;
  publishAt: string | null;
  isFeatured: boolean;
  isUrgent: boolean;
  applicationCount: number;
  openApplicationCount?: number;
  /** "open" of "closed" als de publieke pagina bestaat. */
  publicState: "open" | "closed" | null;
};

export type VacancyTab = "online" | "gepland" | "concepten" | "gesloten" | "archief" | "alle";
export type ApplicationTab =
  | "open"
  | "nieuw"
  | "in_behandeling"
  | "uitgenodigd"
  | "geplaatst"
  | "afgewezen"
  | "ingetrokken"
  | "alle";
export type StaffRequestTab =
  | "open"
  | "nieuw"
  | "in_behandeling"
  | "offerte"
  | "gestart"
  | "afgerond"
  | "geannuleerd"
  | "alle";
export type MessageTab = "nieuw" | "beantwoord" | "gearchiveerd" | "spam" | "alle";

export type ListResult<Row, Tab extends string> = {
  rows: Row[];
  total: number;
  pageCount: number;
  tabCounts: Record<Tab, number>;
};

export type { CloseReason, OccupationSlug, VacancyStatus };
