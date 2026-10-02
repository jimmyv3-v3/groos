import type { ReactElement } from "react";
import type { RequestDuration } from "@/lib/data/options";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailButton, EmailText } from "./components/email-text";
import { FactList, type Fact } from "./components/fact-list";
import { fill } from "./components/fill";
import { NOTIFY_COPY, contactFacts, type NotifyPhone } from "./components/notification-parts";
import { DURATION_LABELS } from "./staff-request-confirmation";
import type { EmailCompany, EmailLocale } from "./types";

/** Template 7: interne melding van een personeelsaanvraag, nl en je-vorm (spec 11 §6.7). */

const COPY = {
  nl: {
    subject: "Nieuwe personeelsaanvraag: {companyName} ({reference})",
    preview: "{companyName} zoekt {headcount} mensen in {workCity}. Bel de opdrachtgever of open de aanvraag.",
    heading: "Nieuwe personeelsaanvraag",
    intro: "{companyName} heeft personeel aangevraagd via de website. De aanvraag staat in Groos Beheer onder {reference}.",
    factsTitle: "De aanvraag",
    company: "Bedrijf",
    kvk: "KvK-nummer",
    contactName: "Contactpersoon",
    staff: "Personeel",
    staffNone: "Niet gekozen",
    other: "Ander werk",
    headcount: "Aantal mensen",
    start: "Start",
    startAsap: "Zo snel mogelijk",
    startDate: "Vanaf {dateLabel}",
    duration: "Duur",
    hours: "Uren per week per persoon",
    workCity: "Plaats van het werk",
    description: "Toelichting",
    descriptionYes: "Ja, lees het in Groos Beheer",
    button: "Open de aanvraag",
    english: "De opdrachtgever gebruikte de Engelse website. De bevestiging is daarom in het Engels verstuurd.",
    noAttachments: "De toelichting staat niet in deze melding. Die lees je in Groos Beheer, na inloggen met je code.",
    footer: "Deze melding gaat naar {companyEmail} en naar beheerders die meldingen voor aanvragen aan hebben staan.",
  },
} as const;

export type StaffRequestNotificationProps = {
  locale: "nl";
  company: EmailCompany;
  reference: string;
  companyName: string;
  kvkNumber: string | null;
  contactName: string;
  phone: NotifyPhone;
  whatsappHref: string | null;
  email: string;
  occupationLabels: string[];
  occupationOther: string | null;
  headcount: number;
  start: { asap: true } | { asap: false; dateLabel: string };
  duration: RequestDuration;
  hoursPerWeek: number | null;
  workCity: string;
  hasDescription: boolean;
  formLocale: EmailLocale;
  utmSource: string | null;
  beheerLink: string;
};

export function staffRequestNotificationSubject(props: StaffRequestNotificationProps): string {
  return cleanSubject(fill(COPY.nl.subject, props));
}

export default function StaffRequestNotification(props: StaffRequestNotificationProps): ReactElement {
  const c = COPY.nl;
  const n = NOTIFY_COPY;
  const facts: Fact[] = [{ label: c.company, value: props.companyName }];
  if (props.kvkNumber) facts.push({ label: c.kvk, value: props.kvkNumber });
  facts.push(
    { label: c.contactName, value: props.contactName },
    ...contactFacts(props),
    {
      label: c.staff,
      value:
        props.occupationLabels.length > 0
          ? new Intl.ListFormat("nl", { type: "conjunction" }).format(props.occupationLabels)
          : c.staffNone,
    },
  );
  if (props.occupationOther) facts.push({ label: c.other, value: props.occupationOther });
  facts.push(
    { label: c.headcount, value: String(props.headcount) },
    { label: c.start, value: props.start.asap ? c.startAsap : fill(c.startDate, { dateLabel: props.start.dateLabel }) },
    { label: c.duration, value: DURATION_LABELS.nl[props.duration] },
  );
  if (props.hoursPerWeek !== null) facts.push({ label: c.hours, value: String(props.hoursPerWeek) });
  facts.push(
    { label: c.workCity, value: props.workCity },
    { label: c.description, value: props.hasDescription ? c.descriptionYes : n.no },
    { label: n.formLocale, value: n.locales[props.formLocale] },
  );
  if (props.utmSource) facts.push({ label: n.origin, value: props.utmSource });

  return (
    <EmailLayout
      locale="nl"
      preview={fill(c.preview, props)}
      heading={c.heading}
      company={props.company}
      footerNote={fill(c.footer, { companyEmail: props.company.email })}
    >
      <EmailText>{fill(c.intro, props)}</EmailText>
      <FactList title={c.factsTitle} facts={facts} />
      <EmailButton href={props.beheerLink}>{c.button}</EmailButton>
      {props.formLocale === "en" && <EmailText>{c.english}</EmailText>}
      <EmailText muted>{c.noAttachments}</EmailText>
    </EmailLayout>
  );
}
