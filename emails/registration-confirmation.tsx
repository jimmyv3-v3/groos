import type { ReactElement } from "react";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailSignoff } from "./components/email-signoff";
import { EmailButton, EmailText, withLink } from "./components/email-text";
import { FactList } from "./components/fact-list";
import { fill } from "./components/fill";
import type { EmailCompany, EmailLinks, EmailLocale } from "./types";

/** Template 2: bevestiging van een inschrijving, je-vorm (spec 11 §6.2). */

const COPY = {
  nl: {
    subject: "Wij hebben je inschrijving ontvangen ({reference})",
    preview: "Je inschrijving bij Groos is goed aangekomen. Wij bellen of appen je om kennis te maken.",
    heading: "Bedankt voor je inschrijving",
    greeting: "Hoi {greetingName},",
    greetingNoName: "Hoi,",
    received: "Wij hebben je inschrijving goed ontvangen. Je referentienummer is {reference}.",
    next: "Jimmy of Lorenzo belt of appt je om te horen welk werk je zoekt. Is er passend werk, dan nemen wij opnieuw contact met je op.",
    nextResponse:
      "Jimmy of Lorenzo belt of appt je binnen één werkdag om te horen welk werk je zoekt. Is er passend werk, dan nemen wij opnieuw contact met je op.",
    factsTitle: "Wat wij van je hebben ontvangen",
    reference: "Referentienummer",
    interest: "Interesse in",
    interestNone: "Nog niet gekozen",
    phone: "Telefoonnummer",
    cv: "Cv",
    cvAdded: "Toegevoegd",
    cvNotAdded: "Niet toegevoegd",
    amend: "Klopt je telefoonnummer niet, of wil je iets aanvullen? Bel of app ons dan op {companyPhone} en noem je referentienummer.",
    button: "Bekijk vacatures",
    consent:
      "Je hebt ons toestemming gegeven om je gegevens een jaar te bewaren en je te benaderen voor werk. Hebben wij twaalf weken geen contact gehad, dan sluiten wij je inschrijving af.",
    withdraw: "Wil je niet meer ingeschreven staan? Mail dan naar {companyEmail}, dan verwijderen wij je gegevens.",
    privacyLink: "privacyverklaring",
    privacy: "In onze privacyverklaring lees je hoe wij met je gegevens omgaan. Daar staat ook hoe lang wij ze bewaren.",
    footer: "Je krijgt deze e-mail omdat je je via onze website hebt ingeschreven.",
  },
  en: {
    subject: "We have received your registration ({reference})",
    preview: "Your registration with Groos has arrived safely. We will call or message you to get to know you.",
    heading: "Thank you for registering",
    greeting: "Hi {greetingName},",
    greetingNoName: "Hi,",
    received: "We have received your registration. Your reference number is {reference}.",
    next: "Jimmy or Lorenzo will call or message you to hear what work you are looking for. When there is suitable work, we will contact you again.",
    nextResponse:
      "Jimmy or Lorenzo will call or message you within one working day to hear what work you are looking for. When there is suitable work, we will contact you again.",
    factsTitle: "What we received from you",
    reference: "Reference number",
    interest: "Interested in",
    interestNone: "Not chosen yet",
    phone: "Phone number",
    cv: "CV",
    cvAdded: "Added",
    cvNotAdded: "Not added",
    amend: "Is your phone number wrong, or would you like to add something? Call or message us on {companyPhone} and mention your reference number.",
    button: "View jobs",
    consent:
      "You have given us permission to keep your details for one year and to contact you about work. If we have had no contact for twelve weeks, we close your registration.",
    withdraw: "Do you no longer want to be registered? Email {companyEmail} and we will delete your details.",
    privacyLink: "privacy statement",
    privacy: "Read in our privacy statement how we handle your details. It also explains how long we keep them.",
    footer: "You are receiving this email because you registered through our website.",
  },
} as const;

export type RegistrationConfirmationProps = {
  locale: EmailLocale;
  company: EmailCompany;
  greetingName: string | null;
  reference: string;
  occupationLabels: string[];
  phoneDisplay: string;
  hasCv: boolean;
  showResponseTime: boolean;
  links: Pick<EmailLinks, "privacy" | "vacancies">;
};

export function registrationConfirmationSubject(props: RegistrationConfirmationProps): string {
  return cleanSubject(fill(COPY[props.locale].subject, { reference: props.reference }));
}

export default function RegistrationConfirmation(props: RegistrationConfirmationProps): ReactElement {
  const c = COPY[props.locale];
  const values = { ...props, companyPhone: props.company.phoneDisplay, companyEmail: props.company.email };
  const interest =
    props.occupationLabels.length > 0
      ? new Intl.ListFormat(props.locale, { type: "conjunction" }).format(props.occupationLabels)
      : c.interestNone;
  return (
    <EmailLayout locale={props.locale} preview={c.preview} heading={c.heading} company={props.company} footerNote={c.footer}>
      <EmailText>{props.greetingName ? fill(c.greeting, values) : c.greetingNoName}</EmailText>
      <EmailText>{fill(c.received, values)}</EmailText>
      <EmailText>{props.showResponseTime ? c.nextResponse : c.next}</EmailText>
      <FactList
        title={c.factsTitle}
        facts={[
          { label: c.reference, value: props.reference },
          { label: c.interest, value: interest },
          { label: c.phone, value: props.phoneDisplay },
          { label: c.cv, value: props.hasCv ? c.cvAdded : c.cvNotAdded },
        ]}
      />
      <EmailText>{fill(c.amend, values)}</EmailText>
      <EmailButton href={props.links.vacancies}>{c.button}</EmailButton>
      <EmailText>{c.consent}</EmailText>
      <EmailText>{fill(c.withdraw, values)}</EmailText>
      <EmailText>{withLink(c.privacy, c.privacyLink, props.links.privacy.inschrijven)}</EmailText>
      <EmailSignoff locale={props.locale} />
    </EmailLayout>
  );
}
