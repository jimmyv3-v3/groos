import { z } from "zod";
import { OCCUPATION_SLUGS } from "@/lib/data/options";
import { jobseekerBaseSchema } from "./application";
import { metaSchema } from "./shared";

/**
 * Inschrijving zonder vacature (spec 07 §5.4). Zelfde basis als solliciteren,
 * plus beroepen en het verplichte toestemmingsvinkje (B-08). De foutcode
 * registerConsentRequired toont forms.privacy.registerConsent.error.
 */
export const registrationSchema = jobseekerBaseSchema.extend({
  occupations: z
    .array(z.enum(OCCUPATION_SLUGS, { error: "occupationsInvalid" }), { error: "occupationsInvalid" })
    .optional()
    .transform((list) => [...new Set(list ?? [])])
    .pipe(z.array(z.enum(OCCUPATION_SLUGS)).max(OCCUPATION_SLUGS.length, { error: "occupationsInvalid" })),
  retentionConsent: z
    .string()
    .optional()
    .transform((v) => v === "on")
    .pipe(z.literal(true, { error: "registerConsentRequired" })),
  ...metaSchema.shape,
});

export type RegistrationInput = z.output<typeof registrationSchema>;

export const REGISTER_CONSENT_ERROR = "registerConsentRequired";
