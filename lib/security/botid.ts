import "server-only";
import { checkBotId } from "botid/server";

type Bypass = "HUMAN" | "BAD-BOT" | "GOOD-BOT";

/**
 * True als BotID het verzoek als bot ziet (spec 13 §4.4). Buiten Vercel
 * (next dev én next start op localhost) geeft BotID standaard "mens"; met
 * BOTID_DEV_BYPASS=BAD-BOT simuleer je een bot. Op Vercel (VERCEL=1) is de
 * controle echt en wordt BOTID_DEV_BYPASS genegeerd.
 */
export async function isBotRequest(): Promise<boolean> {
  const onVercel = process.env.VERCEL === "1";
  const raw = process.env.BOTID_DEV_BYPASS;
  const bypass: Bypass | undefined =
    !onVercel && (raw === "HUMAN" || raw === "BAD-BOT" || raw === "GOOD-BOT") ? raw : undefined;
  const result = await checkBotId({
    developmentOptions: { isDevelopment: !onVercel, bypass },
  });
  return result.isBot;
}
