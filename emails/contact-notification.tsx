import type { ReactElement } from "react";
import type { ContactTopic } from "@/lib/data/options";
import { cleanSubject } from "@/lib/email/sanitize";
import { TOPIC_LABELS } from "./contact-confirmation";
import { EmailLayout } from "./components/email-layout";
import { EmailButton, EmailText } from "./components/email-text";
import { FactList } from "./components/fact-list";
import { fill } from "./components/fill";
import { NOTIFY_COPY, contactFacts, type NotifyPhone } from "./components/notification-parts";
import type { EmailCompany, EmailLocale } from "./types";

/** Template 8: interne melding van een contactbericht, nl en je-vorm (spec 11 §6.8). */

const COPY = {
  nl: {
    subjectCallback: "Terugbelverzoek van {name}",
    subject: "Nieuw bericht via de website van {name}",
    previewCallback: "{name} wil teruggebeld worden. Het nummer staat in deze melding.",
    preview: "Onderwerp: {topicLabel}. Lees het bericht in Groos Beheer.",
    headingCallback: "Terugbelverzoek",
    heading: "Nieuw bericht",
    introCallback: "{name} vraagt om teruggebeld te worden op {phoneDisplay}. Het verzoek staat ook in Groos Beheer bij Berichten.",
    intro: "{name} heeft een bericht gestuurd via het contactformulier. Het onderwerp is {topicLabel}.",
    topic: "Onderwerp",
    message: "Bericht",
    messageYes: "Ja, lees het in Groos Beheer",
    button: "Open het bericht",
    noAttachments: "Deze melding bevat bewust niet de tekst van het bericht. Die lees je in Groos Beheer, na inloggen met je code.",
    footer: "Deze melding gaat naar {companyEmail} en naar beheerders die meldingen voor berichten aan hebben staan.",
  },
} as const;

export type ContactNotificationProps = {
  locale: "nl";
  company: EmailCompany;
  name: string;
  phone: NotifyPhone;
  whatsappHref: string | null;
  email: string | null;
  topic: ContactTopic;
  hasMessage: boolean;
  formLocale: EmailLocale;
  beheerLink: string;
};

export function contactNotificationSubject(props: ContactNotificationProps): string {
  return cleanSubject(fill(props.topic === "callback" ? COPY.nl.subjectCallback : COPY.nl.subject, props));
}

export default function ContactNotification(props: ContactNotificationProps): ReactElement {
  const c = COPY.nl;
  const n = NOTIFY_COPY;
  const callback = props.topic === "callback";
  const values = {
    name: props.name,
    topicLabel: TOPIC_LABELS.nl[props.topic],
    phoneDisplay: props.phone?.display ?? n.empty,
  };
  return (
    <EmailLayout
      locale="nl"
      preview={fill(callback ? c.previewCallback : c.preview, values)}
      heading={callback ? c.headingCallback : c.heading}
      company={props.company}
      footerNote={fill(c.footer, { companyEmail: props.company.email })}
    >
      <EmailText>{fill(callback ? c.introCallback : c.intro, values)}</EmailText>
      <FactList
        facts={[
          { label: n.name, value: props.name },
          ...contactFacts({ ...props, whatsappOnlyWithPhone: true }),
          { label: c.topic, value: values.topicLabel },
          { label: c.message, value: props.hasMessage ? c.messageYes : n.no },
          { label: n.formLocale, value: n.locales[props.formLocale] },
        ]}
      />
      <EmailButton href={props.beheerLink}>{c.button}</EmailButton>
      <EmailText muted>{c.noAttachments}</EmailText>
    </EmailLayout>
  );
}
