import "server-only";
import { createHash } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { EmailEntity, EmailTemplateName, SendEmailResult } from "./types";

/** Verzendverslag in email_log (spec 11 §4.6). Nooit onderwerp, tekst, naam of adres. */

/** sha-256 (hex, 64 tekens) van de adressen in kleine letters, gesorteerd en met "," verbonden. */
export function hashRecipients(to: string[]): string {
  const normalized = [...new Set(to.map((a) => a.trim().toLowerCase()))].sort().join(",");
  return createHash("sha256").update(normalized).digest("hex");
}

/** Haalt e-mailadressen uit een foutmelding (vervangen door "[adres]") en kort in tot 500 tekens. */
export function cleanError(message: string | undefined): string {
  const text = (message ?? "onbekende fout").replace(/[^\s@<>"',;:()]+@[^\s@<>"',;:()]+/g, "[adres]");
  return text.slice(0, 500);
}

const STATUS: Record<SendEmailResult["status"], "sent" | "queued" | "failed"> = {
  sent: "sent",
  console: "queued",
  failed: "failed",
};

export async function writeEmailLog(row: {
  template: EmailTemplateName;
  to: string[];
  entity: EmailEntity | null;
  result: SendEmailResult;
}): Promise<void> {
  const { result } = row;
  const { error } = await createSupabaseAdminClient()
    .from("email_log")
    .insert({
      template: row.template,
      to_hash: hashRecipients(row.to),
      entity_type: row.entity?.type ?? null,
      entity_id: row.entity?.id ?? null,
      provider_message_id: result.status === "sent" ? result.providerId : result.status === "console" ? "console" : null,
      status: STATUS[result.status],
      error: result.status === "failed" ? cleanError(result.error) : null,
    });
  if (error) throw Object.assign(new Error("email_log"), { pgCode: error.code });
}
