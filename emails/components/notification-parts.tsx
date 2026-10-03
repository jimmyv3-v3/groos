import type { EmailLocale } from "../types";
import { EmailLink } from "./email-text";
import type { Fact } from "./fact-list";

/** Gedeelde feiten en teksten van de interne meldingen (alleen nl, spec 11 §6.5 tot en met §6.9). */

export const NOTIFY_COPY = {
  yes: "Ja",
  no: "Nee",
  empty: "Niet ingevuld",
  name: "Naam",
  phone: "Telefoon",
  whatsapp: "WhatsApp",
  whatsappValue: "Stuur een bericht",
  email: "E-mail",
  formLocale: "Taal van het formulier",
  origin: "Herkomst",
  locales: { nl: "Nederlands", en: "Engels" } as Record<EmailLocale, string>,
} as const;

export type NotifyPhone = { display: string; href: string } | null;

export function yesNo(value: boolean | null): string {
  if (value === null) return NOTIFY_COPY.empty;
  return value ? NOTIFY_COPY.yes : NOTIFY_COPY.no;
}

/** Telefoon, WhatsApp en e-mail als links. */
export function contactFacts(input: {
  phone: NotifyPhone;
  whatsappHref: string | null;
  email: string | null;
  whatsappOnlyWithPhone?: boolean;
}): Fact[] {
  const c = NOTIFY_COPY;
  const facts: Fact[] = [
    { label: c.phone, value: input.phone ? <EmailLink href={input.phone.href}>{input.phone.display}</EmailLink> : c.empty },
  ];
  if (input.whatsappHref) {
    facts.push({ label: c.whatsapp, value: <EmailLink href={input.whatsappHref}>{c.whatsappValue}</EmailLink> });
  } else if (!input.whatsappOnlyWithPhone) {
    facts.push({ label: c.whatsapp, value: c.empty });
  }
  facts.push({
    label: c.email,
    value: input.email ? <EmailLink href={`mailto:${input.email}`}>{input.email}</EmailLink> : c.empty,
  });
  return facts;
}
