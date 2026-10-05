import "server-only";
import { createElement } from "react";
import type { StatusMailKind } from "@/app/beheer/_lib/status";
import ApplicationInvitation, { applicationInvitationSubject } from "@/emails/application-invitation";
import ApplicationPlacement, { applicationPlacementSubject } from "@/emails/application-placement";
import ApplicationRejection, { applicationRejectionSubject } from "@/emails/application-rejection";
import type { EmailLocale } from "@/emails/types";
import { formatDate, formatTime } from "@/lib/format";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { emailCompany, emailLinks } from "./company";
import { safeEcho } from "./sanitize";
import { sendEmail } from "./send";
import type { SendEmailResult } from "./types";

/**
 * Mail aan een kandidaat bij een statuswijziging in het beheer: uitnodiging,
 * afwijzing of welkom na plaatsing. De statusactie roept dit alleen aan na
 * een expliciete keuze in de dialoog. Gooit nooit.
 */

/** "skipped": geen e-mailadres of geanonimiseerd, er is niets verstuurd. */
export type StatusMailResult = "sent" | "skipped" | "failed";

export async function sendApplicationStatusEmail(input: {
  applicationId: string;
  kind: StatusMailKind;
  /** Alleen bij een uitnodiging: datum (jjjj-mm-dd) en tijd (uu:mm) van de kennismaking. */
  meeting?: { date: string; time: string };
}): Promise<StatusMailResult> {
  try {
    const { data: row, error } = await createSupabaseAdminClient()
      .from("applications")
      .select("id, reference, kind, first_name, email, locale, vacancy_title_snapshot, retention_consent, anonymized_at")
      .eq("id", input.applicationId)
      .single();
    if (error || !row) {
      console.warn("[e-mail] statusmail overgeslagen: record niet gevonden", error?.code ? { pgCode: error.code } : "");
      return "failed";
    }
    if (!row.email || row.anonymized_at) return "skipped";

    const locale: EmailLocale = row.locale === "en" ? "en" : "nl";
    const base = {
      locale,
      company: emailCompany(locale),
      greetingName: safeEcho(row.first_name, 40),
      reference: row.reference,
      vacancyTitle: row.kind === "vacancy" ? row.vacancy_title_snapshot : null,
      links: emailLinks(locale),
    };
    const entity = { type: "application" as const, id: row.id };
    // Een eigen sleutel per verzending: dezelfde status kan later opnieuw gekozen worden.
    const key = (template: string) => `${template}/${row.id}/${crypto.randomUUID()}`;

    let result: SendEmailResult;
    if (input.kind === "invitation") {
      if (!input.meeting) return "failed";
      const props = {
        ...base,
        dateLabel: formatDate(input.meeting.date, locale, { weekday: true }),
        timeLabel: formatTime(input.meeting.time, locale),
      };
      result = await sendEmail({
        template: "application-invitation",
        to: [row.email],
        subject: applicationInvitationSubject(props),
        react: createElement(ApplicationInvitation, props),
        entity,
        idempotencyKey: key("application-invitation"),
      });
    } else if (input.kind === "rejection") {
      const props = { ...base, retentionConsent: row.retention_consent };
      result = await sendEmail({
        template: "application-rejection",
        to: [row.email],
        subject: applicationRejectionSubject(props),
        react: createElement(ApplicationRejection, props),
        entity,
        idempotencyKey: key("application-rejection"),
      });
    } else {
      result = await sendEmail({
        template: "application-placement",
        to: [row.email],
        subject: applicationPlacementSubject(base),
        react: createElement(ApplicationPlacement, base),
        entity,
        idempotencyKey: key("application-placement"),
      });
    }
    return result.status === "failed" ? "failed" : "sent";
  } catch (error) {
    console.error("[e-mail] sendApplicationStatusEmail mislukt", { error: error instanceof Error ? error.name : "onbekend" });
    return "failed";
  }
}
