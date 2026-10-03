import { z } from "zod";
import { S } from "../../_strings";

/** Gedeelde schema's (spec 08 §5.5). Client en server. */
export const uuid = z.uuid();

export const searchParamsSchema = z.object({
  q: z.string().max(80).optional(),
  pagina: z.coerce.number().int().min(1).catch(1),
});

export const noteSchema = z.object({
  entityType: z.enum(["application", "staff_request"]),
  entityId: uuid,
  body: z.string().trim().min(2, S.validation.noteTooShort).max(4000, S.validation.noteTooLong),
});

export const contactAttemptSchema = z.object({
  entityType: z.enum(["application", "staff_request", "contact_message"]),
  entityId: uuid,
  channel: z.enum(["call", "whatsapp", "email"]),
});

/** Veldfouten van zod als Record<veld, meldingen[]>. */
export function fieldErrorsOf(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "_form";
    out[key] = [...(out[key] ?? []), issue.message];
  }
  return out;
}

/** Eerste waarde van een zoekparameter. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
