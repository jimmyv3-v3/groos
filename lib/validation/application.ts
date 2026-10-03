import { z } from "zod";
import {
  addDays,
  checkbox,
  emailField,
  metaSchema,
  optionalLongText,
  phoneField,
  requiredText,
  todayAmsterdam,
  yesNo,
} from "./shared";

/**
 * Sollicitatie op een vacature (spec 07 §5.4). Foutcodes verwijzen naar
 * forms.jobseeker.errors. Het vacaturenummer zit niet in het schema; het komt
 * via bind binnen. Onbekende sleutels (bsn, geboortedatum en dergelijke)
 * vallen weg, omdat z.object standaard strip gebruikt.
 */

const CV_PENDING_PATH = /^pending\/[0-9a-f-]{36}\.(pdf|doc|docx)$/;

/** Datum vanaf vandaag tot en met vandaag plus 365 dagen. */
const availableFromField = z.iso
  .date({ error: "availableFromInvalid" })
  .refine((v) => v >= todayAmsterdam(), { error: "availableFromPast" })
  .refine((v) => v <= addDays(todayAmsterdam(), 365), { error: "availableFromTooFar" })
  .optional();

/** Velden die solliciteren en inschrijven delen. */
export const jobseekerBaseSchema = z.object({
  firstName: z
    .string({ error: "firstNameRequired" })
    .trim()
    .min(1, { error: "firstNameRequired" })
    .max(80, { error: "firstNameTooLong" }),
  lastName: z
    .string({ error: "lastNameRequired" })
    .trim()
    .min(1, { error: "lastNameRequired" })
    .max(120, { error: "lastNameTooLong" }),
  phone: phoneField({ required: "phoneRequired", invalid: "phoneInvalid" }),
  email: emailField({ required: "emailRequired", invalid: "emailInvalid" }),
  city: requiredText(2, 80, { required: "cityRequired", invalid: "cityInvalid" }),
  mayWorkInNl: yesNo("mayWorkInNlRequired"),
  hasDrivingLicenseB: yesNo("drivingLicenseInvalid").optional(),
  availableFrom: availableFromField,
  message: optionalLongText("messageTooLong"),
  cvPath: z.string().regex(CV_PENDING_PATH, { error: "cvUploadExpired" }).optional(),
  cvFilename: z
    .string()
    .optional()
    .transform((v) => {
      const base = v?.split(/[\\/]/).pop()?.trim();
      return base ? base.slice(0, 200) : undefined;
    }),
});

export const applicationSchema = jobseekerBaseSchema.extend({
  retentionConsent: checkbox,
  ...metaSchema.shape,
});

export type ApplicationInput = z.output<typeof applicationSchema>;

/** Alle foutcodes onder forms.jobseeker.errors; de test controleert ze tegen messages. */
export const JOBSEEKER_ERROR_CODES = [
  "firstNameRequired",
  "firstNameTooLong",
  "lastNameRequired",
  "lastNameTooLong",
  "phoneRequired",
  "phoneInvalid",
  "emailRequired",
  "emailInvalid",
  "cityRequired",
  "cityInvalid",
  "mayWorkInNlRequired",
  "drivingLicenseInvalid",
  "availableFromInvalid",
  "availableFromPast",
  "availableFromTooFar",
  "messageTooLong",
  "occupationsInvalid",
  "cvType",
  "cvTooLarge",
  "cvUploadFailed",
  "cvUploadExpired",
  "cvUploading",
  "vacancyClosed",
  "blocked",
  "generic",
] as const;
export type JobseekerErrorCode = (typeof JOBSEEKER_ERROR_CODES)[number];
