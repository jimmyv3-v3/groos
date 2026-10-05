import type { ReactElement } from "react";
import { cleanSubject } from "@/lib/email/sanitize";
import { EmailLayout } from "./components/email-layout";
import { EmailButton, EmailText } from "./components/email-text";
import { FactList } from "./components/fact-list";
import { fill } from "./components/fill";
import type { EmailCompany } from "./types";

/** Template 12: interne melding dat een mail aan een kandidaat of opdrachtgever niet is aangekomen, nl en je-vorm. */

export type DeliveryFailureReason = "bounced" | "failed" | "suppressed";

/** Templates waarvan een mislukte bezorging gemeld wordt; interne meldingen horen daar niet bij. */
export const DELIVERY_FAILURE_MAIL_LABELS = {
  "application-confirmation": "De bevestiging van de sollicitatie",
  "registration-confirmation": "De bevestiging van de inschrijving",
  "staff-request-confirmation": "De bevestiging van de personeelsaanvraag",
  "contact-confirmation": "De bevestiging van het contactbericht",
  "application-invitation": "De uitnodiging voor een kennismaking",
  "application-rejection": "De afwijzing",
  "application-placement": "De welkomstmail na plaatsing",
} as const;

const COPY = {
  nl: {
    subject: "Een e-mail over {subjectLabel} is niet aangekomen",
    preview: "{mailLabel} is niet bij de ontvanger aangekomen. Bel of app de ontvanger.",
    heading: "E-mail niet aangekomen",
    intro: "{mailLabel} over {subjectLabel} is niet bij de ontvanger aangekomen.",
    advice: "Bel of app de ontvanger, zodat die niet op een bericht blijft wachten. Controleer daarna het e-mailadres in Groos Beheer.",
    mail: "E-mail",
    about: "Gaat over",
    reason: "Reden",
    reasons: {
      bounced: "Het e-mailadres bestaat niet of weigert de e-mail",
      failed: "Het verzenden is mislukt",
      suppressed: "Het e-mailadres is geblokkeerd na een eerdere mislukte bezorging",
    } as Record<DeliveryFailureReason, string>,
    button: "Open in Groos Beheer",
    footer: "Deze melding gaat naar {companyEmail} en naar beheerders die deze meldingen aan hebben staan.",
  },
} as const;

export type DeliveryFailureNotificationProps = {
  locale: "nl";
  company: EmailCompany;
  /** Een waarde uit DELIVERY_FAILURE_MAIL_LABELS. */
  mailLabel: string;
  /** Referentie van de sollicitatie of aanvraag, of "het bericht van <naam>". */
  subjectLabel: string;
  reason: DeliveryFailureReason;
  beheerLink: string;
};

export function deliveryFailureNotificationSubject(props: DeliveryFailureNotificationProps): string {
  return cleanSubject(fill(COPY.nl.subject, props));
}

export default function DeliveryFailureNotification(props: DeliveryFailureNotificationProps): ReactElement {
  const c = COPY.nl;
  return (
    <EmailLayout
      locale="nl"
      preview={fill(c.preview, props)}
      heading={c.heading}
      company={props.company}
      footerNote={fill(c.footer, { companyEmail: props.company.email })}
    >
      <EmailText>{fill(c.intro, props)}</EmailText>
      <EmailText>{c.advice}</EmailText>
      <FactList
        facts={[
          { label: c.mail, value: props.mailLabel },
          { label: c.about, value: props.subjectLabel },
          { label: c.reason, value: c.reasons[props.reason] },
        ]}
      />
      <EmailButton href={props.beheerLink}>{c.button}</EmailButton>
    </EmailLayout>
  );
}
