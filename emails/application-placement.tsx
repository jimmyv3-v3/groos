import type { ReactElement } from "react";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailSignoff } from "./components/email-signoff";
import { EmailText, withLink } from "./components/email-text";
import { fill } from "./components/fill";
import type { EmailCompany, EmailLinks, EmailLocale } from "./types";

/** Template 11: welkom na plaatsing, je-vorm, verstuurd vanuit het beheer bij status Geplaatst. */

const COPY = {
  nl: {
    subject: "Welkom bij Groos ({reference})",
    preview: "Wij hebben goed nieuws voor je. Hier lees je wat er nu gebeurt.",
    heading: "Welkom bij Groos",
    greeting: "Hoi {greetingName},",
    greetingNoName: "Hoi,",
    news: "Wij hebben goed nieuws over je sollicitatie op {vacancyTitle}. Je gaat via Groos Personeelsdiensten aan het werk.",
    newsRegistration: "Wij hebben goed nieuws over je inschrijving. Je gaat via Groos Personeelsdiensten aan het werk.",
    next: "Ons team neemt contact met je op over je eerste werkdag, je werktijden en de plek waar je begint. Dat doen wij vanaf {companyPhone}, dus sla dat nummer op in je telefoon.",
    documents:
      "Stuur ons geen identiteitsbewijs of andere documenten per e-mail. Ons team vertelt je hoe je die veilig aanlevert.",
    questions: "Heb je een vraag? Bel of app ons dan op {companyPhone} en noem je referentienummer {reference}.",
    privacyLink: "privacyverklaring",
    privacy: "In onze privacyverklaring lees je hoe wij met je gegevens omgaan.",
    footer: "Je krijgt deze e-mail omdat je bij Groos Personeelsdiensten hebt gesolliciteerd of je hebt ingeschreven.",
  },
  en: {
    subject: "Welcome to Groos ({reference})",
    preview: "We have good news for you. Here is what happens next.",
    heading: "Welcome to Groos",
    greeting: "Hi {greetingName},",
    greetingNoName: "Hi,",
    news: "We have good news about your application for {vacancyTitle}. You will start working through Groos Personeelsdiensten.",
    newsRegistration: "We have good news about your registration. You will start working through Groos Personeelsdiensten.",
    next: "Our team will contact you about your first working day, your working hours and the place where you start. We will call or message you from {companyPhone}, so save that number in your phone.",
    documents: "Please do not send us an identity document or other documents by email. Our team will explain how to hand them in safely.",
    questions: "Do you have a question? Call or message us on {companyPhone} and mention your reference number {reference}.",
    privacyLink: "privacy statement",
    privacy: "Read in our privacy statement how we handle your details.",
    footer: "You are receiving this email because you applied to or registered with Groos Personeelsdiensten.",
  },
} as const;

export type ApplicationPlacementProps = {
  locale: EmailLocale;
  company: EmailCompany;
  greetingName: string | null;
  reference: string;
  /** null bij een inschrijving zonder vacature. */
  vacancyTitle: string | null;
  links: Pick<EmailLinks, "privacy">;
};

export function applicationPlacementSubject(props: ApplicationPlacementProps): string {
  return cleanSubject(fill(COPY[props.locale].subject, { reference: props.reference }));
}

export default function ApplicationPlacement(props: ApplicationPlacementProps): ReactElement {
  const c = COPY[props.locale];
  const values = { ...props, companyPhone: props.company.phoneDisplay };
  const privacyHref = props.vacancyTitle ? props.links.privacy.solliciteren : props.links.privacy.inschrijven;
  return (
    <EmailLayout locale={props.locale} preview={c.preview} heading={c.heading} company={props.company} footerNote={c.footer}>
      <EmailText>{props.greetingName ? fill(c.greeting, values) : c.greetingNoName}</EmailText>
      <EmailText>{props.vacancyTitle ? fill(c.news, values) : c.newsRegistration}</EmailText>
      <EmailText>{fill(c.next, values)}</EmailText>
      <EmailText>{c.documents}</EmailText>
      <EmailText>{fill(c.questions, values)}</EmailText>
      <EmailText>{withLink(c.privacy, c.privacyLink, privacyHref)}</EmailText>
      <EmailSignoff locale={props.locale} company={props.company} />
    </EmailLayout>
  );
}
