import "server-only";
import { createElement } from "react";
import { beheerPaths, beheerUrl } from "@/app/beheer/_lib/paths";
import DeliveryFailureNotification, {
  DELIVERY_FAILURE_MAIL_LABELS,
  deliveryFailureNotificationSubject,
  type DeliveryFailureReason,
} from "@/emails/delivery-failure-notification";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { emailCompany } from "./company";
import { internalRecipients, type NotifyFlag } from "./recipients";
import { safeEcho } from "./sanitize";
import { sendEmail } from "./send";
import type { EmailEntity } from "./types";

/**
 * Interne melding als een mail aan een kandidaat of opdrachtgever niet is
 * aangekomen. De webhook roept dit aan na een bounce of mislukte verzending.
 * Interne meldingen zelf worden nooit gemeld, zodat er geen lus ontstaat.
 */

export type DeliveryFailure = {
  /** email_log.id van de mail die niet aankwam. */
  logId: number;
  template: string;
  entityType: string | null;
  entityId: string | null;
  reason: DeliveryFailureReason;
};

type Target = { subjectLabel: string; beheerLink: string; flag: NotifyFlag; entity: EmailEntity };

async function resolveTarget(entityType: string | null, entityId: string | null): Promise<Target | null> {
  if (!entityId) return null;
  const db = createSupabaseAdminClient();
  if (entityType === "application") {
    const { data } = await db.from("applications").select("reference").eq("id", entityId).single();
    if (!data) return null;
    return {
      subjectLabel: data.reference,
      beheerLink: beheerUrl(beheerPaths.application(data.reference)),
      flag: "notify_applications",
      entity: { type: "application", id: entityId },
    };
  }
  if (entityType === "staff_request") {
    const { data } = await db.from("staff_requests").select("reference").eq("id", entityId).single();
    if (!data) return null;
    return {
      subjectLabel: data.reference,
      beheerLink: beheerUrl(beheerPaths.request(data.reference)),
      flag: "notify_staff_requests",
      entity: { type: "staff_request", id: entityId },
    };
  }
  if (entityType === "contact_message") {
    const { data } = await db.from("contact_messages").select("name").eq("id", entityId).single();
    if (!data) return null;
    return {
      subjectLabel: `het bericht van ${safeEcho(data.name) ?? "een bezoeker"}`,
      beheerLink: beheerUrl(beheerPaths.message(entityId)),
      flag: "notify_messages",
      entity: { type: "contact_message", id: entityId },
    };
  }
  return null;
}

export async function sendDeliveryFailureAlerts(failures: DeliveryFailure[]): Promise<void> {
  for (const failure of failures) {
    try {
      const mailLabel = (DELIVERY_FAILURE_MAIL_LABELS as Record<string, string | undefined>)[failure.template];
      if (!mailLabel) continue;
      const target = await resolveTarget(failure.entityType, failure.entityId);
      if (!target) continue;
      const props = {
        locale: "nl" as const,
        company: emailCompany("nl"),
        mailLabel,
        subjectLabel: target.subjectLabel,
        reason: failure.reason,
        beheerLink: target.beheerLink,
      };
      await sendEmail({
        template: "delivery-failure-notification",
        to: await internalRecipients(target.flag),
        subject: deliveryFailureNotificationSubject(props),
        react: createElement(DeliveryFailureNotification, props),
        entity: target.entity,
        // Eén melding per mislukte mail, ook als Resend de webhook herhaalt.
        idempotencyKey: `delivery-failure-notification/${failure.logId}`,
      });
    } catch (error) {
      console.error("[e-mail] sendDeliveryFailureAlerts mislukt", { error: error instanceof Error ? error.name : "onbekend" });
    }
  }
}
