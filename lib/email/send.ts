import "server-only";
import { render, toPlainText } from "@react-email/components";
import { Resend } from "resend";
import { z } from "zod";
import { EMAIL_REPLY_TO, emailMode } from "./config";
import { cleanError, writeEmailLog } from "./log";
import { cleanSubject } from "./sanitize";
import type { SendEmailInput, SendEmailResult } from "./types";

/**
 * De enige verzendfunctie voor sitemails (spec 11 §4.5). Gooit nooit: een
 * fout bij renderen, verzenden of loggen laat het formulier nooit falen.
 */

const PLAIN_TEXT_OPTIONS = {
  selectors: ["h1", "h2", "h3"].map((selector) => ({ selector, options: { uppercase: false } })),
};
const emailSchema = z.email();
const RETRY_DELAY_MS = 1000;

let resendClient: Resend | null = null;
function resend(): Resend {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

/** Alleen voor tests: vergeet de Resend-instantie. */
export function resetResendClientForTests(): void {
  resendClient = null;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Attempt = { id: string } | { error: string; retry: boolean };

async function attempt(payload: Parameters<Resend["emails"]["send"]>[0], idempotencyKey: string): Promise<Attempt> {
  try {
    const { data, error } = await resend().emails.send(payload, { idempotencyKey });
    if (data?.id) return { id: data.id };
    const status = error?.statusCode ?? null;
    return { error: error?.message ?? "geen antwoord van Resend", retry: status === null || status === 429 || status >= 500 };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "netwerkfout", retry: true };
  }
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const { template, entity } = input;

  // 1. Controle van de ontvangers.
  const to = [...new Set(input.to.map((a) => a.trim().toLowerCase()))]
    .filter((a) => emailSchema.safeParse(a).success)
    .slice(0, 20);
  if (to.length === 0) {
    console.warn(`[e-mail] geen geldige ontvanger voor template ${template}`);
    return { status: "failed", error: "geen geldige ontvanger" };
  }

  let result: SendEmailResult | undefined;
  try {
    // 2. Renderen.
    let html: string;
    let text: string;
    try {
      html = await render(input.react);
      text = toPlainText(html, PLAIN_TEXT_OPTIONS);
    } catch {
      result = { status: "failed", error: "render" };
      throw new Error("render");
    }

    // 3. Onderwerp.
    const subject = cleanSubject(input.subject);

    // 4. Modus.
    const mode = emailMode();
    if (mode.mode === "misconfigured") {
      console.error("[e-mail] RESEND_API_KEY ontbreekt op productie");
      result = { status: "failed", error: mode.error };
    } else if (mode.mode === "console") {
      if (mode.onVercel) {
        console.info(`[e-mail] template ${template} · niet verstuurd (${mode.reason})`);
      } else {
        console.info(
          `[e-mail] aan ${to.join(", ")} · onderwerp ${subject} · template ${template}\n${text}\n${"=".repeat(40)}`,
        );
      }
      result = { status: "console" };
    } else {
      // 5. Verzenden, met één nieuwe poging bij 429, 5xx of een netwerkfout.
      const payload = {
        from: mode.from,
        to: mode.mode === "redirect" ? [mode.devTo] : to,
        subject: mode.mode === "redirect" ? cleanSubject(`[test voor ${to.join(", ")}] ${subject}`) : subject,
        html,
        text,
        replyTo: EMAIL_REPLY_TO,
        tags: [{ name: "template", value: template }],
      };
      const key = input.idempotencyKey ?? `${template}/${entity.id}`;
      let outcome = await attempt(payload, key);
      if ("error" in outcome && outcome.retry) {
        await wait(RETRY_DELAY_MS);
        outcome = await attempt(payload, key);
      }
      result = "id" in outcome ? { status: "sent", providerId: outcome.id } : { status: "failed", error: cleanError(outcome.error) };
    }
  } catch {
    // De oorzaak staat al in result (render) of wordt hieronder generiek.
  }
  const final: SendEmailResult = result ?? { status: "failed", error: "onverwachte fout" };

  // 6. Loggen.
  try {
    await writeEmailLog({ template, to, entity, result: final });
  } catch (error) {
    const pgCode = (error as { pgCode?: string }).pgCode;
    console.error("[e-mail] email_log schrijven mislukt", { template, pgCode });
  }

  // 7. Fouten melden, zonder adres.
  if (final.status === "failed") {
    console.error("[e-mail] verzenden mislukt", { template, entity: entity.type, error: final.error });
  }
  return final;
}
