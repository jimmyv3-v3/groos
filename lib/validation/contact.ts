import { z } from "zod";
import { CONTACT_TOPICS } from "@/lib/data/options";
import { MESSAGE_MAX, emailField, metaSchema, phoneField, requiredText } from "./shared";

/**
 * Contactbericht (spec 07 §5.4). Foutcodes verwijzen naar
 * forms.contactForm.errors. De kruiscontroles spiegelen de checks
 * contact_messages_reachable, _callback en _body van spec 10.
 */
export const contactSchema = z
  .object({
    name: requiredText(2, 120, { required: "nameRequired", invalid: "nameInvalid" }),
    phone: phoneField({ required: "phoneInvalid", invalid: "phoneInvalid" }).optional(),
    email: emailField({ required: "emailInvalid", invalid: "emailInvalid" }).optional(),
    topic: z.enum(CONTACT_TOPICS, { error: "topicRequired" }),
    message: z
      .string()
      .trim()
      .min(2, { error: "messageRequired" })
      .max(MESSAGE_MAX, { error: "messageTooLong" })
      .optional(),
    ...metaSchema.shape,
  })
  .superRefine(
    (value, ctx) => {
      if (value.phone === undefined && value.email === undefined) {
        ctx.addIssue({ code: "custom", message: "reachRequired", path: ["phone"] });
        ctx.addIssue({ code: "custom", message: "reachRequired", path: ["email"] });
      } else if (value.topic === "callback" && value.phone === undefined) {
        ctx.addIssue({ code: "custom", message: "phoneRequiredForCallback", path: ["phone"] });
      }
      if (value.topic !== undefined && value.topic !== "callback" && value.message === undefined) {
        ctx.addIssue({ code: "custom", message: "messageRequired", path: ["message"] });
      }
    },
    { when: () => true },
  );

export type ContactInput = z.output<typeof contactSchema>;

export const CONTACT_ERROR_CODES = [
  "nameRequired",
  "nameInvalid",
  "reachRequired",
  "phoneInvalid",
  "phoneRequiredForCallback",
  "emailInvalid",
  "topicRequired",
  "messageRequired",
  "messageTooLong",
  "blocked",
  "generic",
] as const;
export type ContactErrorCode = (typeof CONTACT_ERROR_CODES)[number];
