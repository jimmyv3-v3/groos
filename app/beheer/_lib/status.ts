/** Statussen, tonen en toegestane acties (spec 08 §4.2, §5.3 tabel 2). Client-veilig. */
import type {
  ApplicationStatus,
  CloseReason,
  MessageStatus,
  StaffRequestStatus,
  VacancyStatus,
} from "@/lib/data/options";
import { S } from "../_strings";
import type {
  ApplicationTab,
  BadgeTone,
  MessageTab,
  StaffRequestTab,
  VacancyActionKey,
  VacancyTab,
} from "./types";

export type { BadgeTone };

export type VacancyDisplayStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "expired"
  | "filled"
  | "withdrawn"
  | "closed_other"
  | "archived";

/** published met closesAt <= now en closed met reden expired: "expired"; closed: filled, withdrawn of closed_other. */
export function vacancyDisplayStatus(
  v: { status: VacancyStatus; closesAt: string | null; closeReason: CloseReason | null },
  now: Date = new Date(),
): VacancyDisplayStatus {
  if (v.status === "published") {
    return v.closesAt && Date.parse(v.closesAt) <= now.getTime() ? "expired" : "published";
  }
  if (v.status === "closed") {
    if (v.closeReason === "expired") return "expired";
    if (v.closeReason === "filled") return "filled";
    if (v.closeReason === "withdrawn") return "withdrawn";
    return "closed_other";
  }
  return v.status;
}

export const STATUS_TONE: {
  vacancy: Record<VacancyDisplayStatus, BadgeTone>;
  application: Record<ApplicationStatus, BadgeTone>;
  staffRequest: Record<StaffRequestStatus, BadgeTone>;
  message: Record<MessageStatus, BadgeTone>;
} = {
  vacancy: {
    draft: "neutral",
    scheduled: "info",
    published: "success",
    expired: "warning",
    filled: "warning",
    withdrawn: "warning",
    closed_other: "warning",
    archived: "neutral",
  },
  application: {
    new: "brand",
    in_progress: "info",
    invited: "info",
    placed: "success",
    rejected: "danger",
    withdrawn: "neutral",
  },
  staffRequest: {
    new: "brand",
    in_progress: "info",
    quote_sent: "info",
    started: "success",
    completed: "neutral",
    cancelled: "neutral",
  },
  message: { new: "brand", answered: "success", archived: "neutral", spam: "danger" },
};

export const VACANCY_ACTIONS: Record<VacancyStatus, readonly VacancyActionKey[]> = {
  draft: ["edit", "preview", "publish", "schedule", "archive", "duplicate", "delete"],
  scheduled: ["edit", "preview", "publishNow", "reschedule", "unschedule", "duplicate"],
  published: [
    "edit",
    "preview",
    "viewOnSite",
    "copyLink",
    "shareWhatsapp",
    "extend",
    "closeFilled",
    "close",
    "takeOffline",
    "feature",
    "urgent",
    "duplicate",
    "viewApplications",
  ],
  closed: ["edit", "preview", "viewOnSite", "reopen", "archive", "duplicate", "viewApplications"],
  archived: ["preview", "restore", "duplicate", "viewApplications"],
};

export function isPublicStatus(s: VacancyStatus): boolean {
  return s === "published" || s === "closed";
}

export const APPLICATION_FINAL: readonly ApplicationStatus[] = ["placed", "rejected", "withdrawn"];

/** Statussen waarbij het beheer de kandidaat een e-mail kan sturen, en welke. */
export type StatusMailKind = "invitation" | "rejection" | "placement";
export const APPLICATION_STATUS_MAIL: Partial<Record<ApplicationStatus, StatusMailKind>> = {
  invited: "invitation",
  rejected: "rejection",
  placed: "placement",
};

/** Statussen per tabblad. */
export const VACANCY_TABS: Record<VacancyTab, readonly VacancyStatus[]> = {
  online: ["published"],
  gepland: ["scheduled"],
  concepten: ["draft"],
  gesloten: ["closed"],
  archief: ["archived"],
  alle: ["draft", "scheduled", "published", "closed", "archived"],
};

export const APPLICATION_TABS: Record<ApplicationTab, readonly ApplicationStatus[]> = {
  open: ["new", "in_progress", "invited"],
  nieuw: ["new"],
  in_behandeling: ["in_progress"],
  uitgenodigd: ["invited"],
  geplaatst: ["placed"],
  afgewezen: ["rejected"],
  ingetrokken: ["withdrawn"],
  alle: ["new", "in_progress", "invited", "placed", "rejected", "withdrawn"],
};

export const STAFF_REQUEST_TABS: Record<StaffRequestTab, readonly StaffRequestStatus[]> = {
  open: ["new", "in_progress", "quote_sent", "started"],
  nieuw: ["new"],
  in_behandeling: ["in_progress"],
  offerte: ["quote_sent"],
  gestart: ["started"],
  afgerond: ["completed"],
  geannuleerd: ["cancelled"],
  alle: ["new", "in_progress", "quote_sent", "started", "completed", "cancelled"],
};

export const MESSAGE_TABS: Record<MessageTab, readonly MessageStatus[]> = {
  nieuw: ["new"],
  beantwoord: ["answered"],
  gearchiveerd: ["archived"],
  spam: ["spam"],
  alle: ["new", "answered", "archived", "spam"],
};

/** Kiest een geldig tabblad uit de zoekparameter, anders de standaard. */
export function pickTab<T extends string>(value: string | string[] | undefined, tabs: Record<T, unknown>, fallback: T): T {
  const v = Array.isArray(value) ? value[0] : value;
  return v && Object.hasOwn(tabs, v) ? (v as T) : fallback;
}

/** Telt per tabblad op basis van een lijst statussen. */
export function countTabs<T extends string, St extends string>(
  statuses: readonly St[],
  tabs: Record<T, readonly St[]>,
): Record<T, number> {
  const counts = {} as Record<T, number>;
  for (const key of Object.keys(tabs) as T[]) {
    const set = tabs[key];
    counts[key] = statuses.filter((s) => set.includes(s)).length;
  }
  return counts;
}

type QualificationLabels = typeof S.options.qualification;

/** Label van een kwalificatie; onbekende waarden (zoals het oude "dav") tonen de code. */
export function qualificationLabel(q: string): string {
  const labels: Record<string, string> = S.options.qualification as QualificationLabels;
  return labels[q] ?? q;
}

/** Kwalificaties die het formulier aanbiedt (zonder "dav", spec 10 VR-13). */
export const FORM_QUALIFICATIONS = Object.keys(S.options.qualification) as (keyof QualificationLabels)[];
