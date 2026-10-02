import type { ReactElement } from "react";
import type { ContactTopic } from "@/lib/data/options";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailSignoff } from "./components/email-signoff";
import { EmailText, withLink } from "./components/email-text";
import { FactList } from "./components/fact-list";
import { fill } from "./components/fill";
import type { EmailCompany, EmailLinks, EmailLocale } from "./types";

/** Template 4: bevestiging van een contactbericht, u-vorm (spec 11 §6.4). */

export const TOPIC_LABELS: Record<EmailLocale, Record<ContactTopic, string>> = {
  nl: { job_seeker: "Ik zoek werk", employer: "Ik zoek personeel", callback: "Bel mij terug", other: "Iets anders" },
  en: {
    job_seeker: "I am looking for work",
    employer: "I am looking for staff",
    callback: "Call me back",
    other: "Something else",
  },
};

const COPY = {
  nl: {
    subject: "Wij hebben uw bericht ontvangen",
    preview: "Uw bericht aan Groos Personeelsdiensten is goed aangekomen.",
    heading: "Bedankt voor uw bericht",
    greeting: "Beste {greetingName},",
    greetingNoName: "Goedendag,",
    receivedCallback:
      "Wij hebben uw verzoek om terug te bellen goed ontvangen. Jimmy of Lorenzo belt u op het nummer dat u heeft ingevuld.",
    received: "Wij hebben uw bericht goed ontvangen. Jimmy of Lorenzo leest het en antwoordt u per e-mail of telefoon.",
    topic: "Onderwerp",
    jobSeeker: "Zoekt u werk? Dan kunt u zich ook direct inschrijven op onze website.",
    jobSeekerLink: "inschrijven",
    employer: "Zoekt u personeel? Dan kunt u ook direct personeel aanvragen op onze website.",
    employerLink: "personeel aanvragen",
    hurry: "Heeft u haast? Bel ons dan op {companyPhone}.",
    privacyLink: "privacyverklaring",
    privacy: "Wij gebruiken uw gegevens alleen om uw bericht te beantwoorden. In onze privacyverklaring leest u hoe wij daarmee omgaan.",
    footer: "U krijgt deze e-mail omdat u via onze website een bericht heeft gestuurd.",
  },
  en: {
    subject: "We have received your message",
    preview: "Your message to Groos Personeelsdiensten has arrived safely.",
    heading: "Thank you for your message",
    greeting: "Dear {greetingName},",
    greetingNoName: "Hello,",
    receivedCallback: "We have received your request to be called back. Jimmy or Lorenzo will call you on the number you entered.",
    received: "We have received your message. Jimmy or Lorenzo will read it and reply by email or phone.",
    topic: "Subject",
    jobSeeker: "Looking for work? You can also register on our website straight away.",
    jobSeekerLink: "register",
    employer: "Looking for staff? You can also request staff on our website straight away.",
    employerLink: "request staff",
    hurry: "Are you in a hurry? Then call us on {companyPhone}.",
    privacyLink: "privacy statement",
    privacy: "We only use your details to answer your message. Read in our privacy statement how we handle them.",
    footer: "You are receiving this email because you sent us a message through our website.",
  },
} as const;

export type ContactConfirmationProps = {
  locale: EmailLocale;
  company: EmailCompany;
  greetingName: string | null;
  topic: ContactTopic;
  links: Pick<EmailLinks, "privacy" | "register" | "staffRequest">;
};

export function contactConfirmationSubject(props: ContactConfirmationProps): string {
  return cleanSubject(COPY[props.locale].subject);
}

export default function ContactConfirmation(props: ContactConfirmationProps): ReactElement {
  const c = COPY[props.locale];
  const values = { ...props, companyPhone: props.company.phoneDisplay };
  return (
    <EmailLayout locale={props.locale} preview={c.preview} heading={c.heading} company={props.company} footerNote={c.footer}>
      <EmailText>{props.greetingName ? fill(c.greeting, values) : c.greetingNoName}</EmailText>
      <EmailText>{props.topic === "callback" ? c.receivedCallback : c.received}</EmailText>
      <FactList facts={[{ label: c.topic, value: TOPIC_LABELS[props.locale][props.topic] }]} />
      {props.topic === "job_seeker" && <EmailText>{withLink(c.jobSeeker, c.jobSeekerLink, props.links.register)}</EmailText>}
      {props.topic === "employer" && <EmailText>{withLink(c.employer, c.employerLink, props.links.staffRequest)}</EmailText>}
      <EmailText>{fill(c.hurry, values)}</EmailText>
      <EmailText>{withLink(c.privacy, c.privacyLink, props.links.privacy.berichten)}</EmailText>
      <EmailSignoff locale={props.locale} />
    </EmailLayout>
  );
}
