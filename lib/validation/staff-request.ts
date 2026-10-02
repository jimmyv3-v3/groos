import { z } from "zod";
import { OCCUPATION_SLUGS, REQUEST_DURATIONS } from "@/lib/data/options";
import { emailField, metaSchema, optionalLongText, phoneField, requiredText, todayAmsterdam } from "./shared";

/**
 * Personeelsaanvraag (spec 07 §5.4). Foutcodes verwijzen naar
 * forms.staffRequest.errors. De kruiscontroles spiegelen de checks
 * staff_requests_occupation en staff_requests_start van spec 10.
 */

function wholeNumber(codes: { required?: string; invalid: string }, min: number, max: number) {
  return z
    .string(codes.required ? { error: codes.required } : undefined)
    .trim()
    .transform((v) => Number(v))
    .pipe(
      z
        .number({ error: codes.invalid })
        .int({ error: codes.invalid })
        .min(min, { error: codes.invalid })
        .max(max, { error: codes.invalid }),
    );
}

export const staffRequestSchema = z
  .object({
    companyName: requiredText(2, 120, { required: "companyNameRequired", invalid: "companyNameInvalid" }),
    contactName: requiredText(2, 120, { required: "contactNameRequired", invalid: "contactNameInvalid" }),
    phone: phoneField({ required: "phoneRequired", invalid: "phoneInvalid" }),
    email: emailField({ required: "emailRequired", invalid: "emailInvalid" }),
    kvkNumber: z
      .string()
      .transform((v) => v.replace(/\s/g, ""))
      .pipe(z.string().regex(/^[0-9]{8}$/, { error: "kvkInvalid" }))
      .optional(),
    occupations: z
      .array(z.enum(OCCUPATION_SLUGS, { error: "occupationsInvalid" }), { error: "occupationsInvalid" })
      .optional()
      .transform((list) => [...new Set(list ?? [])]),
    occupationOther: z
      .string()
      .trim()
      .min(2, { error: "occupationOtherInvalid" })
      .max(120, { error: "occupationOtherInvalid" })
      .optional(),
    headcount: wholeNumber({ required: "headcountRequired", invalid: "headcountInvalid" }, 1, 500),
    start: z.enum(["asap", "date"], { error: "startRequired" }),
    startDate: z.iso.date({ error: "startDateInvalid" }).optional(),
    duration: z.enum(REQUEST_DURATIONS, { error: "durationInvalid" }).default("unknown"),
    hoursPerWeek: wholeNumber({ invalid: "hoursInvalid" }, 1, 60).optional(),
    workCity: requiredText(2, 80, { required: "workCityRequired", invalid: "workCityInvalid" }),
    description: optionalLongText("descriptionTooLong"),
    ...metaSchema.shape,
  })
  .superRefine(
    (value, ctx) => {
      const occupations = Array.isArray(value.occupations) ? value.occupations : [];
      if (occupations.length === 0 && !value.occupationOther) {
        ctx.addIssue({ code: "custom", message: "occupationsRequired", path: ["occupations"] });
      }
      if (value.start === "date") {
        if (!value.startDate) {
          ctx.addIssue({ code: "custom", message: "startDateRequired", path: ["startDate"] });
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(value.startDate) && value.startDate < todayAmsterdam()) {
          ctx.addIssue({ code: "custom", message: "startDatePast", path: ["startDate"] });
        }
      }
    },
    { when: () => true },
  )
  .transform((value) => ({
    ...value,
    startDate: value.start === "date" ? value.startDate : undefined,
  }));

export type StaffRequestInput = z.output<typeof staffRequestSchema>;

export const STAFF_REQUEST_ERROR_CODES = [
  "companyNameRequired",
  "companyNameInvalid",
  "contactNameRequired",
  "contactNameInvalid",
  "phoneRequired",
  "phoneInvalid",
  "emailRequired",
  "emailInvalid",
  "kvkInvalid",
  "occupationsRequired",
  "occupationsInvalid",
  "occupationOtherInvalid",
  "headcountRequired",
  "headcountInvalid",
  "startRequired",
  "startDateRequired",
  "startDateInvalid",
  "startDatePast",
  "durationInvalid",
  "hoursInvalid",
  "workCityRequired",
  "workCityInvalid",
  "descriptionTooLong",
  "blocked",
  "generic",
] as const;
export type StaffRequestErrorCode = (typeof STAFF_REQUEST_ERROR_CODES)[number];
