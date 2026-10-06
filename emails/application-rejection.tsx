import type { ReactElement } from "react";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailSignoff } from "./components/email-signoff";
import { EmailButton, EmailText, withLink } from "./components/email-text";
import { fill } from "./components/fill";
import type { EmailCompany, EmailLinks, EmailLocale } from "./types";

/** Template 10: afwijzing, je-vorm, verstuurd vanuit het beheer bij status Afgewezen. */

const COPY = {
  nl: {
    subject: "Over je sollicitatie bij Groos ({reference})",
    subjectRegistration: "Over je inschrijving bij Groos ({reference})",
    preview: "Wij hebben je gegevens bekeken en laten je weten wat wij hebben besloten.",
    heading: "Over je sollicitatie",
    headingRegistration: "Over je inschrijving",
    greeting: "Hoi {greetingName},",
    greetingNoName: "Hoi,",
    thanks: "Bedankt voor je sollicitatie op {vacancyTitle} en voor de moeite die je hebt genomen.",
    thanksRegistration: "Bedankt voor je inschrijving en voor de moeite die je hebt genomen.",
    decision: "Wij hebben je sollicitatie bekeken en gaan voor deze vacature niet met je verder.",
    decisionRegistration: "Wij hebben je gegevens bekeken en hebben op dit moment geen passend werk voor je.",
    other: "Zie je op onze website een andere vacature die bij je past, dan ben je van harte welkom om opnieuw te reageren.",
    button: "Bekijk onze vacatures",
    questions: "Heb je een vraag over deze beslissing? Bel of app ons dan op {companyPhone} en noem je referentienummer {reference}.",
    privacyLink: "privacyverklaring",
    privacy:
      "Wij bewaren je gegevens nog vier weken en verwijderen ze daarna. In onze privacyverklaring lees je hoe wij met je gegevens omgaan.",
    consent:
      "Je hebt ons toestemming gegeven om je gegevens een jaar te bewaren voor ander werk. Wil je dat niet meer, mail dan naar {companyEmail} en wij passen het aan.",
    consentPrivacy: "In onze privacyverklaring lees je hoe wij met je gegevens omgaan. Daar staat ook hoe je ze laat verwijderen.",
    footer: "Je krijgt deze e-mail omdat je bij Groos Personeelsdiensten hebt gesolliciteerd of je hebt ingeschreven.",
  },
  en: {
    subject: "About your application to Groos ({reference})",
    subjectRegistration: "About your registration with Groos ({reference})",
    preview: "We have reviewed your details and would like to tell you what we decided.",
    heading: "About your application",
    headingRegistration: "About your registration",
    greeting: "Hi {greetingName},",
    greetingNoName: "Hi,",
    thanks: "Thank you for your application for {vacancyTitle} and for the time you took.",
    thanksRegistration: "Thank you for registering and for the time you took.",
    decision: "We have reviewed your application and will not be taking it further for this job.",
    decisionRegistration: "We have reviewed your details and do not have suitable work for you at the moment.",
    other: "If you see another job on our website that suits you, you are very welcome to apply again.",
    button: "View our jobs",
    questions: "Do you have a question about this decision? Call or message us on {companyPhone} and mention your reference number {reference}.",
    privacyLink: "privacy statement",
    privacy: "We keep your details for another four weeks and then delete them. Read in our privacy statement how we handle your details.",
    consent:
      "You have given us permission to keep your details for one year for other work. If you no longer want this, email {companyEmail} and we will change it.",
    consentPrivacy: "Read in our privacy statement how we handle your details. It also explains how to have them deleted.",
    footer: "You are receiving this email because you applied to or registered with Groos Personeelsdiensten.",
  },
} as const;

export type ApplicationRejectionProps = {
  locale: EmailLocale;
  company: EmailCompany;
  greetingName: string | null;
  reference: string;
  /** null bij een inschrijving zonder vacature. */
  vacancyTitle: string | null;
  retentionConsent: boolean;
  links: Pick<EmailLinks, "privacy" | "vacancies">;
};

export function applicationRejectionSubject(props: ApplicationRejectionProps): string {
  const c = COPY[props.locale];
  return cleanSubject(fill(props.vacancyTitle ? c.subject : c.subjectRegistration, { reference: props.reference }));
}

export default function ApplicationRejection(props: ApplicationRejectionProps): ReactElement {
  const c = COPY[props.locale];
  const vacancy = Boolean(props.vacancyTitle);
  const values = {
    ...props,
    companyPhone: props.company.phoneDisplay,
    companyEmail: props.company.email,
  };
  const privacyHref = vacancy ? props.links.privacy.solliciteren : props.links.privacy.inschrijven;
  return (
    <EmailLayout
      locale={props.locale}
      preview={c.preview}
      heading={vacancy ? c.heading : c.headingRegistration}
      company={props.company}
      footerNote={c.footer}
    >
      <EmailText>{props.greetingName ? fill(c.greeting, values) : c.greetingNoName}</EmailText>
      <EmailText>{vacancy ? fill(c.thanks, values) : c.thanksRegistration}</EmailText>
      <EmailText>{vacancy ? c.decision : c.decisionRegistration}</EmailText>
      <EmailText>{c.other}</EmailText>
      <EmailButton href={props.links.vacancies}>{c.button}</EmailButton>
      <EmailText>{fill(c.questions, values)}</EmailText>
      {props.retentionConsent ? (
        <>
          <EmailText>{fill(c.consent, values)}</EmailText>
          <EmailText>{withLink(c.consentPrivacy, c.privacyLink, privacyHref)}</EmailText>
        </>
      ) : (
        <EmailText>{withLink(c.privacy, c.privacyLink, privacyHref)}</EmailText>
      )}
      <EmailSignoff locale={props.locale} company={props.company} />
    </EmailLayout>
  );
}
