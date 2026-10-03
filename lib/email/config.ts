import "server-only";
import { z } from "zod";
import { contact } from "@/lib/site";

/** Afzender, reply-to en verzendmodus (spec 11 §4.4). */

export const EMAIL_FROM_DEFAULT = "Groos Personeelsdiensten <website@mail.groospersoneelsdiensten.nl>";
export const EMAIL_REPLY_TO: string = contact.email;

export type EmailMode =
  | { mode: "send"; from: string }
  | { mode: "redirect"; from: string; devTo: string }
  | { mode: "console"; reason: "no_key" | "no_dev_to"; onVercel: boolean }
  | { mode: "misconfigured"; error: "RESEND_API_KEY ontbreekt" };

const emailSchema = z.email();
let warnedNoDevTo = false;

/** Leest de omgeving bij elke aanroep, zodat tests de variabelen per geval kunnen zetten. */
export function emailMode(env: NodeJS.ProcessEnv = process.env): EmailMode {
  const key = env.RESEND_API_KEY?.trim();
  const production = env.VERCEL_ENV === "production";
  const onVercel = env.VERCEL === "1";

  if (!key) {
    if (production) return { mode: "misconfigured", error: "RESEND_API_KEY ontbreekt" };
    return { mode: "console", reason: "no_key", onVercel };
  }
  if (production) return { mode: "send", from: EMAIL_FROM_DEFAULT };

  const devTo = env.EMAIL_DEV_TO?.trim();
  if (devTo && emailSchema.safeParse(devTo).success) {
    return { mode: "redirect", from: env.EMAIL_FROM?.trim() || EMAIL_FROM_DEFAULT, devTo };
  }
  if (!warnedNoDevTo) {
    warnedNoDevTo = true;
    console.warn("[e-mail] EMAIL_DEV_TO ontbreekt, niets verstuurd");
  }
  return { mode: "console", reason: "no_dev_to", onVercel };
}
