import type { ReactElement } from "react";

/** Typen van de verzendlaag (spec 11 §4.3). Client-veilig. */

export const EMAIL_TEMPLATE_NAMES = [
  "application-confirmation",
  "application-notification",
  "registration-confirmation",
  "registration-notification",
  "staff-request-confirmation",
  "staff-request-notification",
  "contact-confirmation",
  "contact-notification",
] as const;
export type EmailTemplateName = (typeof EMAIL_TEMPLATE_NAMES)[number];

/** Waarde voor email_log.entity_type (enum entity_type van spec 10). */
export type EmailEntity = { type: "application" | "staff_request" | "contact_message"; id: string };

export type SendEmailInput = {
  template: EmailTemplateName;
  /** Gevalideerde adressen, kleine letters, ontdubbeld, 1 tot 20. */
  to: string[];
  /** Gaat door cleanSubject(). */
  subject: string;
  /** Een template uit emails/. */
  react: ReactElement;
  entity: EmailEntity;
  /** Standaard `${template}/${entity.id}`. */
  idempotencyKey?: string;
};

export type SendEmailResult =
  | { status: "sent"; providerId: string }
  | { status: "console" }
  | { status: "failed"; error: string };
