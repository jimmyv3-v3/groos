import type { ReactElement } from "react";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailButton, EmailText } from "./components/email-text";
import { FactList, type Fact } from "./components/fact-list";
import { fill } from "./components/fill";
import { NOTIFY_COPY, contactFacts, yesNo, type NotifyPhone } from "./components/notification-parts";
import type { EmailCompany, EmailLocale } from "./types";

/** Template 5: interne melding van een sollicitatie, nl en je-vorm (spec 11 §6.5). */

const COPY = {
  nl: {
    subject: "Nieuwe sollicitatie: {fullName} op {vacancyTitle} ({vacancyNumber})",
    preview: "Referentie {reference}. Bel de kandidaat of open de sollicitatie in Groos Beheer.",
    heading: "Nieuwe sollicitatie",
    intro:
      "{fullName} heeft gesolliciteerd op {vacancyTitle}, vacature {vacancyNumber}. De sollicitatie staat in Groos Beheer onder {reference}.",
    factsTitle: "Gegevens van de kandidaat",
    city: "Woonplaats",
    mayWork: "Mag in Nederland werken",
    license: "Rijbewijs B",
    available: "Beschikbaar vanaf",
    availableNow: "Direct of niet ingevuld",
    cv: "Cv",
    cvYes: "Ja, open het in Groos Beheer",
    message: "Bericht",
    messageYes: "Ja, lees het in Groos Beheer",
    consent: "Een jaar bewaren voor ander werk",
    button: "Open de sollicitatie",
    english: "De kandidaat gebruikte de Engelse website. De bevestiging is daarom in het Engels verstuurd.",
    noAttachments: "Deze melding bevat bewust geen cv en geen bericht. Die open je veilig in Groos Beheer, na inloggen met je code.",
    footer: "Deze melding gaat naar {companyEmail} en naar beheerders die meldingen voor sollicitaties aan hebben staan.",
  },
} as const;

export type ApplicationNotificationProps = {
  locale: "nl";
  company: EmailCompany;
  reference: string;
  fullName: string;
  phone: NotifyPhone;
  whatsappHref: string | null;
  email: string | null;
  city: string | null;
  mayWorkInNl: boolean | null;
  hasDrivingLicenseB: boolean | null;
  availableFromLabel: string | null;
  hasCv: boolean;
  hasMessage: boolean;
  retentionConsent: boolean;
  formLocale: EmailLocale;
  utmSource: string | null;
  vacancyTitle: string;
  vacancyNumber: number;
  beheerLink: string;
};

export function applicationNotificationSubject(props: ApplicationNotificationProps): string {
  return cleanSubject(fill(COPY.nl.subject, props));
}

export default function ApplicationNotification(props: ApplicationNotificationProps): ReactElement {
  const c = COPY.nl;
  const n = NOTIFY_COPY;
  const facts: Fact[] = [
    { label: n.name, value: props.fullName },
    ...contactFacts(props),
    { label: c.city, value: props.city ?? n.empty },
    { label: c.mayWork, value: yesNo(props.mayWorkInNl) },
  ];
  if (props.hasDrivingLicenseB !== null) facts.push({ label: c.license, value: yesNo(props.hasDrivingLicenseB) });
  facts.push(
    { label: c.available, value: props.availableFromLabel ?? c.availableNow },
    { label: c.cv, value: props.hasCv ? c.cvYes : n.no },
    { label: c.message, value: props.hasMessage ? c.messageYes : n.no },
    { label: c.consent, value: yesNo(props.retentionConsent) },
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
