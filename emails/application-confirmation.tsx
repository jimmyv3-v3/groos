import type { ReactElement } from "react";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailSignoff } from "./components/email-signoff";
import { EmailButton, EmailText, withLink } from "./components/email-text";
import { FactList } from "./components/fact-list";
import { fill } from "./components/fill";
import type { EmailCompany, EmailLinks, EmailLocale } from "./types";

/** Template 1: bevestiging van een sollicitatie, je-vorm (spec 11 §6.1). */

const COPY = {
  nl: {
    subject: "Wij hebben je sollicitatie ontvangen ({reference})",
    preview: "Je sollicitatie op {vacancyTitle} is goed aangekomen. Hier lees je wat er nu gebeurt.",
    heading: "Bedankt voor je sollicitatie",
    greeting: "Hoi {greetingName},",
    greetingNoName: "Hoi,",
    received: "Wij hebben je sollicitatie op {vacancyTitle} in {vacancyCity} goed ontvangen. Je referentienummer is {reference}.",
    receivedNoCity: "Wij hebben je sollicitatie op {vacancyTitle} goed ontvangen. Je referentienummer is {reference}.",
    next: "{contactName} bekijkt je sollicitatie en neemt daarna contact met je op. Dat doen wij vanaf {contactPhoneDisplay}, dus sla dat nummer op in je telefoon.",
    nextResponse:
      "{contactName} bekijkt je sollicitatie en belt of appt je binnen één werkdag. Dat doen wij vanaf {contactPhoneDisplay}, dus sla dat nummer op in je telefoon.",
    factsTitle: "Wat wij van je hebben ontvangen",
    reference: "Referentienummer",
    vacancy: "Vacature",
    vacancyValue: "{vacancyTitle} (vacature {vacancyNumber})",
    phone: "Telefoonnummer",
    cv: "Cv",
    cvAdded: "Toegevoegd",
    cvNotAdded: "Niet toegevoegd",
    amend: "Klopt je telefoonnummer niet, of wil je iets aanvullen? Bel of app ons dan op {companyPhone} en noem je referentienummer.",
    button: "Bekijk meer vacatures",
    privacyLink: "privacyverklaring",
    privacy:
      "Wij bewaren je gegevens tot vier weken nadat je sollicitatie is afgerond. In onze privacyverklaring lees je hoe wij met je gegevens omgaan.",
    consent:
      "Je hebt ons toestemming gegeven om je gegevens een jaar te bewaren voor ander werk. Wil je dat niet meer, mail dan naar {companyEmail} en wij passen het aan.",
    consentPrivacy:
      "In onze privacyverklaring lees je hoe wij met je gegevens omgaan. Daar staat ook hoe je ze laat verwijderen.",
    footer: "Je krijgt deze e-mail omdat je via onze website hebt gesolliciteerd.",
  },
  en: {
    subject: "We have received your application ({reference})",
    preview: "Your application for {vacancyTitle} has arrived safely. Here is what happens next.",
    heading: "Thank you for your application",
    greeting: "Hi {greetingName},",
    greetingNoName: "Hi,",
    received: "We have received your application for {vacancyTitle} in {vacancyCity}. Your reference number is {reference}.",
    receivedNoCity: "We have received your application for {vacancyTitle}. Your reference number is {reference}.",
    next: "{contactName} will review your application and then get in touch with you. We will call or message you from {contactPhoneDisplay}, so save that number in your phone.",
    nextResponse:
      "{contactName} will review your application and call or message you within one working day. We will contact you from {contactPhoneDisplay}, so save that number in your phone.",
    factsTitle: "What we received from you",
    reference: "Reference number",
    vacancy: "Job",
    vacancyValue: "{vacancyTitle} (job {vacancyNumber})",
    phone: "Phone number",
    cv: "CV",
    cvAdded: "Added",
    cvNotAdded: "Not added",
    amend: "Is your phone number wrong, or would you like to add something? Call or message us on {companyPhone} and mention your reference number.",
    button: "View more jobs",
    privacyLink: "privacy statement",
    privacy:
      "We keep your details until four weeks after your application has been completed. Read in our privacy statement how we handle your details.",
    consent:
      "You have given us permission to keep your details for one year for other work. If you no longer want this, email {companyEmail} and we will change it.",
    consentPrivacy: "Read in our privacy statement how we handle your details. It also explains how to have them deleted.",
    footer: "You are receiving this email because you applied through our website.",
  },
} as const;

export type ApplicationConfirmationProps = {
  locale: EmailLocale;
  company: EmailCompany;
  greetingName: string | null;
  reference: string;
  vacancyTitle: string;
  vacancyNumber: number;
  vacancyCity: string | null;
  contactName: string;
  contactPhoneDisplay: string;
  phoneDisplay: string;
  hasCv: boolean;
  retentionConsent: boolean;
  showResponseTime: boolean;
  links: Pick<EmailLinks, "privacy" | "vacancies">;
};

export function applicationConfirmationSubject(props: ApplicationConfirmationProps): string {
  return cleanSubject(fill(COPY[props.locale].subject, { reference: props.reference }));
}

export default function ApplicationConfirmation(props: ApplicationConfirmationProps): ReactElement {
  const c = COPY[props.locale];
  const values = {
    ...props,
    companyPhone: props.company.phoneDisplay,
    companyEmail: props.company.email,
  };
  const privacyHref = props.links.privacy.solliciteren;
  return (
    <EmailLayout
      locale={props.locale}
      preview={fill(c.preview, values)}
      heading={c.heading}
      company={props.company}
      footerNote={c.footer}
    >
      <EmailText>{props.greetingName ? fill(c.greeting, values) : c.greetingNoName}</EmailText>
      <EmailText>{fill(props.vacancyCity ? c.received : c.receivedNoCity, values)}</EmailText>
      <EmailText>{fill(props.showResponseTime ? c.nextResponse : c.next, values)}</EmailText>
      <FactList
        title={c.factsTitle}
        facts={[
          { label: c.reference, value: props.reference },
          { label: c.vacancy, value: fill(c.vacancyValue, values) },
          { label: c.phone, value: props.phoneDisplay },
          { label: c.cv, value: props.hasCv ? c.cvAdded : c.cvNotAdded },
        ]}
      />
      <EmailText>{fill(c.amend, values)}</EmailText>
      <EmailButton href={props.links.vacancies}>{c.button}</EmailButton>
      {props.retentionConsent ? (
        <>
          <EmailText>{fill(c.consent, values)}</EmailText>
          <EmailText>{withLink(c.consentPrivacy, c.privacyLink, privacyHref)}</EmailText>
        </>
      ) : (
        <EmailText>{withLink(c.privacy, c.privacyLink, privacyHref)}</EmailText>
      )}
      <EmailSignoff locale={props.locale} />
    </EmailLayout>
  );
}
