import type { ReactElement } from "react";
import type { RequestDuration } from "@/lib/data/options";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailSignoff } from "./components/email-signoff";
import { EmailText, withLink } from "./components/email-text";
import { FactList, type Fact } from "./components/fact-list";
import { fill } from "./components/fill";
import type { EmailCompany, EmailLinks, EmailLocale } from "./types";

/** Template 3: bevestiging van een personeelsaanvraag, u-vorm (spec 11 §6.3). */

export const DURATION_LABELS: Record<EmailLocale, Record<RequestDuration, string>> = {
  nl: {
    one_day: "Eén dag",
    days: "Enkele dagen",
    weeks: "Enkele weken",
    months: "Enkele maanden",
    indefinite: "Langdurig",
    unknown: "Weet ik nog niet",
  },
  en: {
    one_day: "One day",
    days: "A few days",
    weeks: "A few weeks",
    months: "A few months",
    indefinite: "Long term",
    unknown: "Not sure yet",
  },
};

const COPY = {
  nl: {
    subject: "Wij hebben uw personeelsaanvraag ontvangen ({reference})",
    preview: "Uw aanvraag is goed aangekomen. Wij nemen contact met u op om hem door te nemen.",
    heading: "Bedankt voor uw aanvraag",
    greeting: "Beste {greetingName},",
    greetingNoName: "Goedendag,",
    received: "Wij hebben uw aanvraag voor personeel goed ontvangen. Uw referentienummer is {reference}.",
    next: "Jimmy of Lorenzo neemt contact met u op om de aanvraag door te nemen. Wij bespreken dan de taken, de werktijden en de startdatum.",
    nextResponse:
      "Jimmy of Lorenzo neemt binnen één werkdag contact met u op om de aanvraag door te nemen. Wij bespreken dan de taken, de werktijden en de startdatum.",
    urgent: "Heeft u snel mensen nodig? Bel ons dan direct op {companyPhone}.",
    urgentAfterHours: "Heeft u snel mensen nodig? Bel ons dan direct op {companyPhone}, ook buiten kantoortijden.",
    factsTitle: "Uw aanvraag in het kort",
    reference: "Referentienummer",
    company: "Bedrijf",
    staff: "Personeel",
    andOther: "{labels} en ander werk",
    otherOnly: "Ander werk",
    headcount: "Aantal mensen",
    start: "Start",
    startAsap: "Zo snel mogelijk",
    startDate: "Vanaf {dateLabel}",
    duration: "Duur",
    hours: "Uren per week per persoon",
    workCity: "Plaats van het werk",
    correction: "Klopt er iets niet in deze samenvatting? Antwoord dan op deze e-mail of bel ons, en noem uw referentienummer.",
    privacyLink: "privacyverklaring",
    privacy: "Wij gebruiken uw gegevens alleen om uw aanvraag te behandelen. In onze privacyverklaring leest u hoe wij daarmee omgaan.",
    footer: "U krijgt deze e-mail omdat u via onze website personeel heeft aangevraagd.",
  },
  en: {
    subject: "We have received your staff request ({reference})",
    preview: "Your request has arrived safely. We will contact you to go through it.",
    heading: "Thank you for your request",
    greeting: "Dear {greetingName},",
    greetingNoName: "Hello,",
    received: "We have received your request for staff. Your reference number is {reference}.",
    next: "Jimmy or Lorenzo will contact you to go through the request. We will then discuss the tasks, the working hours and the start date.",
    nextResponse:
      "Jimmy or Lorenzo will contact you within one working day to go through the request. We will then discuss the tasks, the working hours and the start date.",
    urgent: "Do you need people at short notice? Then call us directly on {companyPhone}.",
    urgentAfterHours: "Do you need people at short notice? Then call us directly on {companyPhone}, also outside office hours.",
    factsTitle: "Your request in brief",
    reference: "Reference number",
    company: "Company",
    staff: "Staff",
    andOther: "{labels} and other work",
    otherOnly: "Other work",
    headcount: "Number of people",
    start: "Start",
    startAsap: "As soon as possible",
    startDate: "From {dateLabel}",
    duration: "Duration",
    hours: "Hours per week per person",
    workCity: "Place of work",
    correction: "Is something in this summary not correct? Reply to this email or call us, and mention your reference number.",
    privacyLink: "privacy statement",
    privacy: "We only use your details to handle your request. Read in our privacy statement how we handle them.",
    footer: "You are receiving this email because you requested staff through our website.",
  },
} as const;

export type StaffRequestConfirmationProps = {
  locale: EmailLocale;
  company: EmailCompany;
  greetingName: string | null;
  reference: string;
  companyName: string | null;
  occupationLabels: string[];
  hasOtherOccupation: boolean;
  headcount: number;
  start: { asap: true } | { asap: false; dateLabel: string };
  duration: RequestDuration;
  hoursPerWeek: number | null;
  workCity: string | null;
  showResponseTime: boolean;
  showAfterHours: boolean;
  links: Pick<EmailLinks, "privacy">;
};

export function staffRequestConfirmationSubject(props: StaffRequestConfirmationProps): string {
  return cleanSubject(fill(COPY[props.locale].subject, { reference: props.reference }));
}

export default function StaffRequestConfirmation(props: StaffRequestConfirmationProps): ReactElement {
  const c = COPY[props.locale];
  const values = { ...props, companyPhone: props.company.phoneDisplay };
  const list = new Intl.ListFormat(props.locale, { type: "conjunction" }).format(props.occupationLabels);
  const staff =
    props.occupationLabels.length === 0
      ? c.otherOnly
      : props.hasOtherOccupation
        ? fill(c.andOther, { labels: list })
        : list;
  const facts: Fact[] = [{ label: c.reference, value: props.reference }];
  if (props.companyName) facts.push({ label: c.company, value: props.companyName });
  facts.push(
    { label: c.staff, value: staff },
    { label: c.headcount, value: String(props.headcount) },
    { label: c.start, value: props.start.asap ? c.startAsap : fill(c.startDate, { dateLabel: props.start.dateLabel }) },
    { label: c.duration, value: DURATION_LABELS[props.locale][props.duration] },
  );
  if (props.hoursPerWeek !== null) facts.push({ label: c.hours, value: String(props.hoursPerWeek) });
  if (props.workCity) facts.push({ label: c.workCity, value: props.workCity });

  return (
    <EmailLayout locale={props.locale} preview={c.preview} heading={c.heading} company={props.company} footerNote={c.footer}>
      <EmailText>{props.greetingName ? fill(c.greeting, values) : c.greetingNoName}</EmailText>
      <EmailText>{fill(c.received, values)}</EmailText>
      <EmailText>{props.showResponseTime ? c.nextResponse : c.next}</EmailText>
      <EmailText>{fill(props.showAfterHours ? c.urgentAfterHours : c.urgent, values)}</EmailText>
      <FactList title={c.factsTitle} facts={facts} />
      <EmailText>{c.correction}</EmailText>
      <EmailText>{withLink(c.privacy, c.privacyLink, props.links.privacy.opdrachtgevers)}</EmailText>
      <EmailSignoff locale={props.locale} />
    </EmailLayout>
  );
}
