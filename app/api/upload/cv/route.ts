import { NextResponse, type NextRequest } from "next/server";
import { isBotRequest } from "@/lib/security/botid";
import { createCvUploadTarget } from "@/lib/supabase/cv-storage";
import { cvUploadRequestSchema } from "@/lib/validation/cv-upload";

/**
 * Geeft na BotID een signed upload URL voor cvs/pending/ (spec 07 §5.6). Het
 * bestand zelf gaat nooit door deze functie. Schrijft niets in de database.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

function json(body: Record<string, string>, status: number) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export async function POST(request: NextRequest) {
  if (await isBotRequest()) return json({ error: "blocked" }, 403);
  if (request.headers.get("origin") !== request.nextUrl.origin) return json({ error: "blocked" }, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "cvType" }, 400);
  }
  const parsed = cvUploadRequestSchema.safeParse(body);
  if (!parsed.success) {
    const code = parsed.error.issues.some((i) => i.message === "cvTooLarge") ? "cvTooLarge" : "cvType";
    return json({ error: code }, 400);
  }

  try {
    const target = await createCvUploadTarget(parsed.data.ext);
    return json({ path: target.path, signedUrl: target.signedUrl, contentType: target.contentType }, 200);
  } catch {
    console.error("[upload] signed upload URL maken mislukt");
    return json({ error: "cvUploadFailed" }, 500);
  }
}
