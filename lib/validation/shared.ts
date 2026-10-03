import { z } from "zod";
import { normalizePhone } from "./phone";

/**
 * Gedeelde typen, constanten en helpers voor de formulieren (spec 07 §5.1).
 * Client-veilig: browser en Server Actions gebruiken dezelfde schema's.
 */

export const FORM_IDS = ["apply", "register", "staffRequest", "contact"] as const;
export type FormId = (typeof FORM_IDS)[number];
export const MIN_FILL_MS = 3000; // spec 14 gebruikt deze constante in wachtInvultijd()
export const MESSAGE_MAX = 2000;
export const LINK_LIMIT = 3; // vanaf 3 links in vrije tekst geldt een inzending als spam
export const ARRAY_FIELDS = ["occupations"] as const;

export type FieldErrors = Partial<Record<string, string>>; // veldnaam -> foutcode
export type FormValues = Partial<Record<string, string | string[]>>; // ruwe invoer voor defaultValue
export type FormState =
  | { status: "idle" }
  | { status: "invalid"; fieldErrors: FieldErrors; values: FormValues }
  | {
      status: "error";
      error: "blocked" | "generic" | "vacancyClosed";
      values: FormValues;
      fieldErrors?: FieldErrors;
    };
export const initialFormState: FormState = { status: "idle" };

/** Lege strings worden undefined; arrayKeys via getAll; $ACTION_-sleutels en bestanden vallen weg. */
export function formDataToRecord(fd: FormData, arrayKeys: readonly string[]): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const key of new Set(fd.keys())) {
    if (key.startsWith("$ACTION_")) continue;
    if (arrayKeys.includes(key)) {
      record[key] = fd
        .getAll(key)
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.trim())
        .filter((v) => v !== "");
      continue;
    }
    const value = fd.get(key);
    if (typeof value !== "string") continue;
    record[key] = value.trim() === "" ? undefined : value;
  }
  return record;
}

/** Eerste issue per pad; pad[0] is de veldnaam, de boodschap is de foutcode. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const name = issue.path[0];
    if (typeof name !== "string" || errors[name]) continue;
    errors[name] = issue.message;
  }
  return errors;
}

const NEVER_ECHO = new Set(["cvPath", "submissionId", "website", "fillMs"]);

/** Alleen strings en string-arrays; nooit cvPath, submissionId of website; teksten ingekort tot 2.000 tekens. */
export function valuesForState(record: Record<string, unknown>): FormValues {
  const values: FormValues = {};
  for (const [key, value] of Object.entries(record)) {
    if (NEVER_ECHO.has(key)) continue;
    if (typeof value === "string") values[key] = value.slice(0, MESSAGE_MAX);
    else if (Array.isArray(value)) {
      values[key] = value.filter((v): v is string => typeof v === "string").map((v) => v.slice(0, 200));
    }
  }
  return values;
}

/** "YYYY-MM-DD" in Europe/Amsterdam. */
export function todayAmsterdam(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Telt http(s):// en www. in vrije tekst. */
export function countLinks(text: string | undefined): number {
  if (!text) return 0;
  return (text.match(/https?:\/\/|www\./gi) ?? []).length;
}

export const metaSchema = z.object({
  submissionId: z.uuid().optional().catch(undefined),
  fillMs: z.coerce.number().int().nonnegative().optional().catch(undefined),
  locale: z.enum(["nl", "en"]).default("nl").catch("nl"),
  utmSource: z.string().max(100).optional().catch(undefined),
  utmMedium: z.string().max(100).optional().catch(undefined),
  utmCampaign: z.string().max(100).optional().catch(undefined),
  website: z.string().max(200).optional().catch("filled"), // honeypot; inhoud wordt in de actie gecontroleerd
});

/* Bouwstenen voor velden ---------------------------------------------------- */

/** Verplichte tekst met een minimum en maximum. */
export function requiredText(min: number, max: number, codes: { required: string; invalid: string }) {
  return z
    .string({ error: codes.required })
    .trim()
    .min(1, { error: codes.required })
    .min(min, { error: codes.invalid })
    .max(max, { error: codes.invalid });
}

/** Telefoonnummer als E.164-string. */
export function phoneField(codes: { required: string; invalid: string }) {
  return z
    .string({ error: codes.required })
    .trim()
    .transform((value, ctx) => {
      const normalized = normalizePhone(value);
      if (!normalized) {
        ctx.addIssue({ code: "custom", message: codes.invalid });
        return z.NEVER;
      }
      return normalized;
    });
}

/** E-mailadres in kleine letters. */
export function emailField(codes: { required: string; invalid: string }) {
  return z
    .string({ error: codes.required })
    .trim()
    .toLowerCase()
    .max(254, { error: codes.invalid })
    .pipe(z.email({ error: codes.invalid }));
}

/** Optionele vrije tekst tot MESSAGE_MAX tekens. */
export function optionalLongText(code: string) {
  return z.string().trim().max(MESSAGE_MAX, { error: code }).optional();
}

/** Ja of nee als boolean. */
export function yesNo(code: string) {
  return z.enum(["yes", "no"], { error: code }).transform((v) => v === "yes");
}

/** Vinkje: "on" wordt true, ontbreken false. */
export const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on");
