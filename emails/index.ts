import type { ReactElement } from "react";
import type { EmailTemplateName } from "@/lib/email/types";
import ApplicationConfirmation, { applicationConfirmationSubject } from "./application-confirmation";
import ApplicationInvitation, { applicationInvitationSubject } from "./application-invitation";
import ApplicationNotification, { applicationNotificationSubject } from "./application-notification";
import ApplicationPlacement, { applicationPlacementSubject } from "./application-placement";
import ApplicationRejection, { applicationRejectionSubject } from "./application-rejection";
import ContactConfirmation, { contactConfirmationSubject } from "./contact-confirmation";
import ContactNotification, { contactNotificationSubject } from "./contact-notification";
import DeliveryFailureNotification, { deliveryFailureNotificationSubject } from "./delivery-failure-notification";
import RegistrationConfirmation, { registrationConfirmationSubject } from "./registration-confirmation";
import RegistrationNotification, { registrationNotificationSubject } from "./registration-notification";
import StaffRequestConfirmation, { staffRequestConfirmationSubject } from "./staff-request-confirmation";
import StaffRequestNotification, { staffRequestNotificationSubject } from "./staff-request-notification";
import type { EmailLocale } from "./types";

/** Register van alle templates (spec 11 §4.13). Interne meldingen alleen in het Nederlands. */

export type TemplateEntry<P> = {
  Component: (props: P) => ReactElement;
  subject: (props: P) => string;
  locales: readonly EmailLocale[];
};

const BOTH = ["nl", "en"] as const;
const NL = ["nl"] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EMAIL_TEMPLATES: { [K in EmailTemplateName]: TemplateEntry<any> } = {
  "application-confirmation": { Component: ApplicationConfirmation, subject: applicationConfirmationSubject, locales: BOTH },
  "application-notification": { Component: ApplicationNotification, subject: applicationNotificationSubject, locales: NL },
  "registration-confirmation": { Component: RegistrationConfirmation, subject: registrationConfirmationSubject, locales: BOTH },
  "registration-notification": { Component: RegistrationNotification, subject: registrationNotificationSubject, locales: NL },
  "staff-request-confirmation": { Component: StaffRequestConfirmation, subject: staffRequestConfirmationSubject, locales: BOTH },
  "staff-request-notification": { Component: StaffRequestNotification, subject: staffRequestNotificationSubject, locales: NL },
  "contact-confirmation": { Component: ContactConfirmation, subject: contactConfirmationSubject, locales: BOTH },
  "contact-notification": { Component: ContactNotification, subject: contactNotificationSubject, locales: NL },
  "application-invitation": { Component: ApplicationInvitation, subject: applicationInvitationSubject, locales: BOTH },
  "application-rejection": { Component: ApplicationRejection, subject: applicationRejectionSubject, locales: BOTH },
  "application-placement": { Component: ApplicationPlacement, subject: applicationPlacementSubject, locales: BOTH },
  "delivery-failure-notification": {
    Component: DeliveryFailureNotification,
    subject: deliveryFailureNotificationSubject,
    locales: NL,
  },
};
