import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { cleanError } from "./log";

/** Resend-webhook: handtekening controleren en email_log bijwerken (spec 11 §4.11). */

export type ResendWebhookEvent = {
  type:
    | "email.sent"
    | "email.delivered"
    | "email.delivery_delayed"
    | "email.bounced"
    | "email.complained"
    | "email.failed"
    | "email.suppressed"
    | "email.opened"
    | "email.clicked"
    | "email.received"
    | "email.scheduled";
  created_at: string;
  data: { email_id: string; bounce?: { message?: string; type?: string } };
};

const TOLERANCE_SECONDS = 300;

/** Standard Webhooks (Svix): HMAC-SHA256 over `${id}.${timestamp}.${body}` met de base64-sleutel na "whsec_". */
export function verifyResendWebhook(input: {
  body: string;
  id: string | null;
  timestamp: string | null;
  signature: string | null;
  secret: string;
  now?: number;
}): ResendWebhookEvent {
  const { body, id, timestamp, signature, secret } = input;
  if (!id || !timestamp || !signature) throw new Error("invalid_signature");

  const seconds = Number(timestamp);
  const now = Math.floor((input.now ?? Date.now()) / 1000);
  if (!Number.isFinite(seconds) || Math.abs(now - seconds) > TOLERANCE_SECONDS) throw new Error("stale_timestamp");

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = Buffer.from(createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64"));
  const valid = signature.split(" ").some((part) => {
    const [version, value] = part.split(",");
    if (version !== "v1" || !value) return false;
    const candidate = Buffer.from(value);
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  });
  if (!valid) throw new Error("invalid_signature");

  let event: ResendWebhookEvent;
  try {
    event = JSON.parse(body) as ResendWebhookEvent;
  } catch {
    throw new Error("invalid_signature");
  }
  if (!event?.type || typeof event.data?.email_id !== "string") throw new Error("invalid_signature");
  return event;
}

/** Werkt email_log bij voor bezorging, bounce en mislukking. Gooit bij een databasefout. */
export async function applyWebhookEvent(event: ResendWebhookEvent): Promise<{ updated: number }> {
  const db = createSupabaseAdminClient();
  const id = event.data.email_id;
  let query;
  switch (event.type) {
    case "email.delivered":
      query = db.from("email_log").update({ status: "delivered" }).eq("provider_message_id", id).in("status", ["queued", "sent"]);
      break;
    case "email.bounced":
      query = db
        .from("email_log")
        .update({ status: "bounced", error: cleanError(event.data.bounce?.message ?? "bounced") })
        .eq("provider_message_id", id);
      break;
    case "email.failed":
    case "email.suppressed":
      query = db.from("email_log").update({ status: "failed", error: cleanError(event.type) }).eq("provider_message_id", id);
      break;
    case "email.complained":
      query = db.from("email_log").update({ error: "complained" }).eq("provider_message_id", id);
      break;
    default:
      return { updated: 0 };
  }
  const { data, error } = await query.select("id");
  if (error) throw Object.assign(new Error("email_log"), { pgCode: error.code });
  return { updated: data?.length ?? 0 };
}
