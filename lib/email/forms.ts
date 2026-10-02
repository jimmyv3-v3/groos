import "server-only";
import { createElement } from "react";
import { beheerPaths, beheerUrl } from "@/app/beheer/_lib/paths";
import ApplicationConfirmation, { applicationConfirmationSubject } from "@/emails/application-confirmation";
import ApplicationNotification, { applicationNotificationSubject } from "@/emails/application-notification";
import ContactConfirmation, { contactConfirmationSubject } from "@/emails/contact-confirmation";
import ContactNotification, { contactNotificationSubject } from "@/emails/contact-notification";
import RegistrationConfirmation, { registrationConfirmationSubject } from "@/emails/registration-confirmation";
import RegistrationNotification, { registrationNotificationSubject } from "@/emails/registration-notification";
import StaffRequestConfirmation, { staffRequestConfirmationSubject } from "@/emails/staff-request-confirmation";
import StaffRequestNotification, { staffRequestNotificationSubject } from "@/emails/staff-request-notification";
import type { EmailLocale } from "@/emails/types";
import { isClaimConfirmed } from "@/lib/claims";
import { OCCUPATION_SLUGS, type ContactTopic, type OccupationSlug, type RequestDuration } from "@/lib/data/options";
import { formatDate } from "@/lib/format";
import { contact, people } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatPhoneDisplay } from "@/lib/validation/phone";
import beroepenEn from "@/messages/en/beroepen.json";
import beroepenNl from "@/messages/nl/beroepen.json";
import { emailCompany, emailLinks } from "./company";
import { internalRecipients } from "./recipients";
import { safeEcho } from "./sanitize";
import { sendEmail } from "./send";

/**
 * De vier functies die de Server Actions van spec 07 in after() aanroepen
 * (spec 11 §4.10). Elke functie leest het record zelf, stuurt eerst de
 * bevestiging en daarna de interne melding, en gooit nooit.
 */

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

function asLocale(value: string | null | undefined): EmailLocale {
  return value === "en" ? "en" : "nl";
}

function notifyPhone(e164: string | null): { display: string; href: string } | null {
  return e164 ? { display: formatPhoneDisplay(e164), href: `tel:${e164}` } : null;
}

function whatsappHref(e164: string | null): string | null {
  return e164 ? `https://wa.me/${e164.replace(/^\+/, "")}` : null;
}

function utmSource(utm: Json | null): string | null {
  if (!utm || typeof utm !== "object" || Array.isArray(utm)) return null;
  const source = utm.source;
  return typeof source === "string" && /^[a-z0-9._-]{1,100}$/.test(source) ? source : null;
}

function jimmyOfLorenzo(locale: EmailLocale): string {
  return new Intl.ListFormat(locale, { type: "disjunction" }).format(people.map((p) => p.firstName));
}

const FALLBACK_LABELS = { nl: beroepenNl, en: beroepenEn } as const;

/** Beroepsnamen in de volgorde van sort_order; valt terug op messages als de tabel niet te lezen is. */
async function occupationLabels(
  slugs: string[],
  locale: EmailLocale,
  form: "singular" | "plural",
): Promise<string[]> {
  const known = slugs.filter((s): s is OccupationSlug => (OCCUPATION_SLUGS as readonly string[]).includes(s));
  if (known.length === 0) return [];
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from("occupations")
      .select("slug, name_nl, name_en, plural_nl, plural_en, sort_order")
      .in("slug", known)
      .order("sort_order");
    if (error || !data) throw new Error(error?.code ?? "occupations");
    return data.map((row) =>
      form === "singular"
        ? locale === "nl" ? row.name_nl : row.name_en
        : locale === "nl" ? row.plural_nl : row.plural_en,
    );
  } catch {
    const labels = FALLBACK_LABELS[locale];
    return OCCUPATION_SLUGS.filter((s) => known.includes(s)).map((s) =>
      form === "singular" ? labels[s].enkelvoud : labels[s].meervoud,
    );
  }
}

function logSkip(fn: string, reason: string, pgCode?: string) {
  console.warn(`[e-mail] ${fn} overgeslagen: ${reason}`, pgCode ? { pgCode } : "");
}

/* Sollicitatie en inschrijving -------------------------------------------- */

const APPLICATION_SELECT = `id, reference, kind, first_name, last_name, email, phone_e164, city,
  may_work_in_nl, available_from, has_driving_license_b, message, cv_path, retention_consent,
  locale, utm, vacancy_number, vacancy_title_snapshot, anonymized_at, occupation_slugs,
  vacancy:vacancies(city, contact:admin_profiles!contact_admin_id(display_name, phone_e164, whatsapp_e164, is_active))`;

type ApplicationRow = {
  id: string;
  reference: string;
  kind: "vacancy" | "registration";
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_e164: string | null;
  city: string | null;
  may_work_in_nl: boolean | null;
  available_from: string | null;
  has_driving_license_b: boolean | null;
  message: string | null;
  cv_path: string | null;
  retention_consent: boolean;
  locale: string;
  utm: Json | null;
  vacancy_number: number | null;
  vacancy_title_snapshot: string | null;
  anonymized_at: string | null;
  occupation_slugs: string[];
  vacancy: {
    city: string | null;
    contact: { display_name: string; phone_e164: string | null; whatsapp_e164: string | null; is_active: boolean } | null;
  } | null;
};

async function loadApplication(applicationId: string): Promise<ApplicationRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from("applications")
    .select(APPLICATION_SELECT)
    .eq("id", applicationId)
    .single();
  if (error || !data) {
    logSkip("sollicitatie", "record niet gevonden", error?.code);
    return null;
  }
  return data as unknown as ApplicationRow;
}

function fullName(row: { first_name: string | null; last_name: string | null }): string {
  return [row.first_name, row.last_name].filter(Boolean).join(" ") || "Onbekend";
}

export async function sendApplicationEmails(input: { applicationId: string }): Promise<void> {
  try {
    const row = await loadApplication(input.applicationId);
    if (!row) return;
    if (row.kind !== "vacancy" || row.anonymized_at) {
      logSkip("sollicitatie", "geen vacaturesollicitatie of geanonimiseerd");
      return;
    }
    const locale = asLocale(row.locale);
    const entity = { type: "application" as const, id: row.id };
    // Contactpersoon alleen als hij actief is en een telefoonnummer heeft, anders "Jimmy of Lorenzo" met het hoofdnummer.
    const c = row.vacancy?.contact;
    const person = c?.is_active && c.phone_e164 ? { name: c.display_name, phoneE164: c.phone_e164 } : null;
    const vacancyTitle = row.vacancy_title_snapshot ?? "";
    const vacancyNumber = row.vacancy_number ?? 0;

    if (row.email) {
      const props = {
        locale,
        company: emailCompany(locale),
        greetingName: safeEcho(row.first_name, 40),
        reference: row.reference,
        vacancyTitle,
        vacancyNumber,
        vacancyCity: row.vacancy?.city ?? null,
        contactName: person ? person.name : jimmyOfLorenzo(locale),
        contactPhoneDisplay: person ? formatPhoneDisplay(person.phoneE164) : contact.phone,
        phoneDisplay: row.phone_e164 ? formatPhoneDisplay(row.phone_e164) : "",
        hasCv: Boolean(row.cv_path),
        retentionConsent: row.retention_consent,
        showResponseTime: isClaimConfirmed("responseTime"),
        links: emailLinks(locale),
      };
      await sendEmail({
        template: "application-confirmation",
        to: [row.email],
        subject: applicationConfirmationSubject(props),
        react: createElement(ApplicationConfirmation, props),
        entity,
      });
    }

    const notify = {
      locale: "nl" as const,
      company: emailCompany("nl"),
      reference: row.reference,
      fullName: fullName(row),
      phone: notifyPhone(row.phone_e164),
      whatsappHref: whatsappHref(row.phone_e164),
      email: row.email,
      city: row.city,
      mayWorkInNl: row.may_work_in_nl,
      hasDrivingLicenseB: row.has_driving_license_b,
      availableFromLabel: row.available_from ? formatDate(row.available_from, "nl") : null,
      hasCv: Boolean(row.cv_path),
      hasMessage: Boolean(row.message?.trim()),
      retentionConsent: row.retention_consent,
      formLocale: locale,
      utmSource: utmSource(row.utm),
      vacancyTitle,
      vacancyNumber,
      beheerLink: beheerUrl(beheerPaths.application(row.reference)),
    };
    await sendEmail({
      template: "application-notification",
      to: await internalRecipients("notify_applications"),
      subject: applicationNotificationSubject(notify),
      react: createElement(ApplicationNotification, notify),
      entity,
    });
  } catch (error) {
    console.error("[e-mail] sendApplicationEmails mislukt", { error: error instanceof Error ? error.name : "onbekend" });
  }
}

export async function sendRegistrationEmails(input: { applicationId: string }): Promise<void> {
  try {
    const row = await loadApplication(input.applicationId);
    if (!row) return;
    if (row.kind !== "registration" || row.anonymized_at) {
      logSkip("inschrijving", "geen inschrijving of geanonimiseerd");
      return;
    }
    const locale = asLocale(row.locale);
    const entity = { type: "application" as const, id: row.id };

    if (row.email) {
      const props = {
        locale,
        company: emailCompany(locale),
        greetingName: safeEcho(row.first_name, 40),
        reference: row.reference,
        occupationLabels: await occupationLabels(row.occupation_slugs, locale, "singular"),
        phoneDisplay: row.phone_e164 ? formatPhoneDisplay(row.phone_e164) : "",
        hasCv: Boolean(row.cv_path),
        showResponseTime: isClaimConfirmed("responseTime"),
        links: emailLinks(locale),
      };
      await sendEmail({
        template: "registration-confirmation",
        to: [row.email],
        subject: registrationConfirmationSubject(props),
        react: createElement(RegistrationConfirmation, props),
        entity,
      });
    }

    const notify = {
      locale: "nl" as const,
      company: emailCompany("nl"),
      reference: row.reference,
      fullName: fullName(row),
      phone: notifyPhone(row.phone_e164),
      whatsappHref: whatsappHref(row.phone_e164),
      email: row.email,
      city: row.city,
      mayWorkInNl: row.may_work_in_nl,
      hasDrivingLicenseB: row.has_driving_license_b,
      availableFromLabel: row.available_from ? formatDate(row.available_from, "nl") : null,
      hasCv: Boolean(row.cv_path),
      hasMessage: Boolean(row.message?.trim()),
      formLocale: locale,
      utmSource: utmSource(row.utm),
      occupationLabels: await occupationLabels(row.occupation_slugs, "nl", "singular"),
      beheerLink: beheerUrl(beheerPaths.application(row.reference)),
    };
    await sendEmail({
      template: "registration-notification",
      to: await internalRecipients("notify_applications"),
      subject: registrationNotificationSubject(notify),
      react: createElement(RegistrationNotification, notify),
      entity,
    });
  } catch (error) {
    console.error("[e-mail] sendRegistrationEmails mislukt", { error: error instanceof Error ? error.name : "onbekend" });
  }
}

/* Personeelsaanvraag ------------------------------------------------------- */

export async function sendStaffRequestEmails(input: { staffRequestId: string }): Promise<void> {
  try {
    const { data: row, error } = await createSupabaseAdminClient()
      .from("staff_requests")
      .select(
        "id, reference, company_name, kvk_number, contact_name, email, phone_e164, occupation_slugs, occupation_other, headcount, start_asap, start_date, duration, hours_per_week, work_city, description, locale, utm",
      )
      .eq("id", input.staffRequestId)
      .single();
    if (error || !row) {
      logSkip("aanvraag", "record niet gevonden", error?.code);
      return;
    }
    const locale = asLocale(row.locale);
    const entity = { type: "staff_request" as const, id: row.id };
    const duration = row.duration as RequestDuration;
    const startFor = (l: EmailLocale) =>
      row.start_asap || !row.start_date
        ? ({ asap: true } as const)
        : ({ asap: false, dateLabel: formatDate(row.start_date, l) } as const);

    const props = {
      locale,
      company: emailCompany(locale),
      greetingName: safeEcho(row.contact_name, 40),
      reference: row.reference,
      companyName: safeEcho(row.company_name),
      occupationLabels: await occupationLabels(row.occupation_slugs, locale, "plural"),
      hasOtherOccupation: Boolean(row.occupation_other),
      headcount: row.headcount,
      start: startFor(locale),
      duration,
      hoursPerWeek: row.hours_per_week,
      workCity: safeEcho(row.work_city),
      showResponseTime: isClaimConfirmed("responseTime"),
      showAfterHours: isClaimConfirmed("afterHoursUrgent"),
      links: emailLinks(locale),
    };
    await sendEmail({
      template: "staff-request-confirmation",
      to: [row.email],
      subject: staffRequestConfirmationSubject(props),
      react: createElement(StaffRequestConfirmation, props),
      entity,
    });

    const notify = {
      locale: "nl" as const,
      company: emailCompany("nl"),
      reference: row.reference,
      companyName: row.company_name,
      kvkNumber: row.kvk_number,
      contactName: row.contact_name,
      phone: notifyPhone(row.phone_e164),
      whatsappHref: whatsappHref(row.phone_e164),
      email: row.email,
      occupationLabels: await occupationLabels(row.occupation_slugs, "nl", "plural"),
      occupationOther: row.occupation_other,
      headcount: row.headcount,
      start: startFor("nl"),
      duration,
      hoursPerWeek: row.hours_per_week,
      workCity: row.work_city,
      hasDescription: Boolean(row.description?.trim()),
      formLocale: locale,
      utmSource: utmSource(row.utm as Json | null),
      beheerLink: beheerUrl(beheerPaths.request(row.reference)),
    };
    await sendEmail({
      template: "staff-request-notification",
      to: await internalRecipients("notify_staff_requests"),
      subject: staffRequestNotificationSubject(notify),
      react: createElement(StaffRequestNotification, notify),
      entity,
    });
  } catch (error) {
    console.error("[e-mail] sendStaffRequestEmails mislukt", { error: error instanceof Error ? error.name : "onbekend" });
  }
}

/* Contactbericht ------------------------------------------------------------ */

export async function sendContactEmails(input: { contactMessageId: string }): Promise<void> {
  try {
    const { data: row, error } = await createSupabaseAdminClient()
      .from("contact_messages")
      .select("id, name, email, phone_e164, topic, message, locale, status")
      .eq("id", input.contactMessageId)
      .single();
    if (error || !row) {
      logSkip("contactbericht", "record niet gevonden", error?.code);
      return;
    }
    if (row.status === "spam") return;
    const locale = asLocale(row.locale);
    const entity = { type: "contact_message" as const, id: row.id };
    const topic = row.topic as ContactTopic;

    if (row.email) {
      const props = {
        locale,
        company: emailCompany(locale),
        greetingName: safeEcho(row.name, 40),
        topic,
        links: emailLinks(locale),
      };
      await sendEmail({
        template: "contact-confirmation",
        to: [row.email],
        subject: contactConfirmationSubject(props),
        react: createElement(ContactConfirmation, props),
        entity,
      });
    }

    const notify = {
      locale: "nl" as const,
      company: emailCompany("nl"),
      name: row.name,
      phone: notifyPhone(row.phone_e164),
      whatsappHref: whatsappHref(row.phone_e164),
      email: row.email,
      topic,
      hasMessage: Boolean(row.message?.trim()),
      formLocale: locale,
      beheerLink: beheerUrl(beheerPaths.message(row.id)),
    };
    await sendEmail({
      template: "contact-notification",
      to: await internalRecipients("notify_messages"),
      subject: contactNotificationSubject(notify),
      react: createElement(ContactNotification, notify),
      entity,
    });
  } catch (error) {
    console.error("[e-mail] sendContactEmails mislukt", { error: error instanceof Error ? error.name : "onbekend" });
  }
}
