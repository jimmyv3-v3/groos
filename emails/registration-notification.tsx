import type { ReactElement } from "react";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailButton, EmailText } from "./components/email-text";
import { FactList, type Fact } from "./components/fact-list";
import { fill } from "./components/fill";
import { NOTIFY_COPY, contactFacts, yesNo, type NotifyPhone } from "./components/notification-parts";
import type { EmailCompany, EmailLocale } from "./types";

/** Template 6: interne melding van een inschrijving, nl en je-vorm (spec 11 §6.6). */

const COPY = {
  nl: {
    subject: "Nieuwe inschrijving: {fullName} ({reference})",
    preview: "{fullName} heeft zich ingeschreven zonder vacature. Bel of open de inschrijving in Groos Beheer.",
    heading: "Nieuwe inschrijving",
    intro: "{fullName} heeft zich ingeschreven zonder vacature. De inschrijving staat in Groos Beheer onder {reference}.",
    factsTitle: "Gegevens van de werkzoekende",
    city: "Woonplaats",
    interest: "Interesse in",
    interestNone: "Nog niet gekozen",
    mayWork: "Mag in Nederland werken",
    license: "Rijbewijs B",
    available: "Beschikbaar vanaf",
    availableNow: "Direct of niet ingevuld",
    cv: "Cv",
    cvYes: "Ja, open het in Groos Beheer",
    message: "Bericht",
    messageYes: "Ja, lees het in Groos Beheer",
    button: "Open de inschrijving",
    english: "De werkzoekende gebruikte de Engelse website. De bevestiging is daarom in het Engels verstuurd.",
    noAttachments: "Deze melding bevat bewust geen cv en geen bericht. Die open je veilig in Groos Beheer, na inloggen met je code.",
    footer: "Deze melding gaat naar {companyEmail} en naar beheerders die meldingen voor sollicitaties aan hebben staan.",
  },
} as const;

export type RegistrationNotificationProps = {
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
  formLocale: EmailLocale;
  utmSource: string | null;
  occupationLabels: string[];
  beheerLink: string;
};

export function registrationNotificationSubject(props: RegistrationNotificationProps): string {
  return cleanSubject(fill(COPY.nl.subject, props));
}

export default function RegistrationNotification(props: RegistrationNotificationProps): ReactElement {
  const c = COPY.nl;
  const n = NOTIFY_COPY;
  const interest =
    props.occupationLabels.length > 0
      ? new Intl.ListFormat("nl", { type: "conjunction" }).format(props.occupationLabels)
      : c.interestNone;
  const facts: Fact[] = [
    { label: n.name, value: props.fullName },
    ...contactFacts(props),
    { label: c.city, value: props.city ?? n.empty },
    { label: c.interest, value: interest },
    { label: c.mayWork, value: yesNo(props.mayWorkInNl) },
  ];
  if (props.hasDrivingLicenseB !== null) facts.push({ label: c.license, value: yesNo(props.hasDrivingLicenseB) });
  facts.push(
    { label: c.available, value: props.availableFromLabel ?? c.availableNow },
    { label: c.cv, value: props.hasCv ? c.cvYes : n.no },
    { label: c.message, value: props.hasMessage ? c.messageYes : n.no },
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
