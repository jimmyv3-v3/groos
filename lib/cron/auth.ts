import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * Controle voor /api/cron/* (spec 10 §4.6, spec 13 §5.7). Vercel Cron stuurt
 * zelf `Authorization: Bearer <CRON_SECRET>`. Geeft null als het verzoek mag,
 * anders het antwoord dat de route direct teruggeeft.
 */
export function verifyCronRequest(request: Request): Response | null {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) {
    console.error("[cron] CRON_SECRET ontbreekt of is korter dan 32 tekens.");
    return Response.json({ ok: false, error: "cron_not_configured" }, { status: 500 });
  }
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  const valid = received.length === expected.length && timingSafeEqual(received, expected);
  return valid ? null : Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

/** Foutmelding zonder persoonsgegevens voor het antwoord en de log. */
export function cronErrorResponse(route: string, error: unknown): Response {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
  console.error(`[cron] ${route} mislukt: ${message}`);
  return Response.json({ ok: false, error: message }, { status: 500 });
}
