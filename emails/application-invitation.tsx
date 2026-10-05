import type { ReactElement } from "react";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailSignoff } from "./components/email-signoff";
import { EmailText, withLink } from "./components/email-text";
import { FactList } from "./components/fact-list";
import { fill } from "./components/fill";
import type { EmailCompany, EmailLinks, EmailLocale } from "./types";

/** Template 9: uitnodiging voor een kennismaking, je-vorm, verstuurd vanuit het beheer bij status Uitgenodigd. */

const COPY = {
  nl: {
    subject: "Uitnodiging voor een kennismaking bij Groos ({reference})",
    preview: "Wij nodigen je uit voor een kennismaking op {dateLabel} om {timeLabel} uur.",
    heading: "Je bent uitgenodigd voor een kennismaking",
    greeting: "Hoi {greetingName},",
    greetingNoName: "Hoi,",
    intro: "Wij hebben je sollicitatie op {vacancyTitle} bekeken en maken graag kennis met je.",
    introRegistration: "Wij hebben je inschrijving bekeken en maken graag kennis met je.",
    when: "Je bent welkom op {dateLabel} om {timeLabel} uur bij Groos Personeelsdiensten aan {street} in {city}.",
    factsTitle: "Je afspraak",
    date: "Datum",
    time: "Tijd",
    timeValue: "{timeLabel} uur",
    address: "Adres",
    reference: "Referentienummer",
    reschedule: "Kun je niet op dit moment? Bel of app ons dan op {companyPhone}, dan zoeken wij samen een ander moment.",
    privacyLink: "privacyverklaring",
    privacy: "In onze privacyverklaring lees je hoe wij met je gegevens omgaan.",
    footer: "Je krijgt deze e-mail omdat je bij Groos Personeelsdiensten hebt gesolliciteerd of je hebt ingeschreven.",
  },
  en: {
    subject: "Invitation to meet Groos ({reference})",
    preview: "We would like to meet you on {dateLabel} at {timeLabel}.",
    heading: "You are invited to meet us",
    greeting: "Hi {greetingName},",
    greetingNoName: "Hi,",
    intro: "We have reviewed your application for {vacancyTitle} and would like to meet you.",
    introRegistration: "We have reviewed your registration and would like to meet you.",
    when: "You are welcome on {dateLabel} at {timeLabel} at Groos Personeelsdiensten, {street} in {city}.",
    factsTitle: "Your appointment",
    date: "Date",
    time: "Time",
    timeValue: "{timeLabel}",
    address: "Address",
    reference: "Reference number",
    reschedule: "Can you not make it at this time? Call or message us on {companyPhone} and we will find another time together.",
    privacyLink: "privacy statement",
    privacy: "Read in our privacy statement how we handle your details.",
    footer: "You are receiving this email because you applied to or registered with Groos Personeelsdiensten.",
  },
} as const;

export type ApplicationInvitationProps = {
  locale: EmailLocale;
  company: EmailCompany;
  greetingName: string | null;
  reference: string;
  /** null bij een inschrijving zonder vacature. */
  vacancyTitle: string | null;
  /** formatDate(datum, locale, { weekday: true }) */
  dateLabel: string;
  /** formatTime(tijd, locale) */
  timeLabel: string;
  links: Pick<EmailLinks, "privacy">;
};

export function applicationInvitationSubject(props: ApplicationInvitationProps): string {
  return cleanSubject(fill(COPY[props.locale].subject, { reference: props.reference }));
}

export default function ApplicationInvitation(props: ApplicationInvitationProps): ReactElement {
  const c = COPY[props.locale];
  const values = {
    ...props,
    street: props.company.street,
    city: props.company.city,
    companyPhone: props.company.phoneDisplay,
  };
  const privacyHref = props.vacancyTitle ? props.links.privacy.solliciteren : props.links.privacy.inschrijven;
  return (
    <EmailLayout
      locale={props.locale}
      preview={fill(c.preview, values)}
      heading={c.heading}
      company={props.company}
      footerNote={c.footer}
    >
      <EmailText>{props.greetingName ? fill(c.greeting, values) : c.greetingNoName}</EmailText>
      <EmailText>{props.vacancyTitle ? fill(c.intro, values) : c.introRegistration}</EmailText>
      <EmailText>{fill(c.when, values)}</EmailText>
      <FactList
        title={c.factsTitle}
        facts={[
          { label: c.date, value: props.dateLabel },
          { label: c.time, value: fill(c.timeValue, values) },
          { label: c.address, value: `${props.company.street}, ${props.company.postalCode} ${props.company.city}` },
          { label: c.reference, value: props.reference },
        ]}
      />
      <EmailText>{fill(c.reschedule, values)}</EmailText>
      <EmailText>{withLink(c.privacy, c.privacyLink, privacyHref)}</EmailText>
      <EmailSignoff locale={props.locale} company={props.company} />
    </EmailLayout>
  );
}
