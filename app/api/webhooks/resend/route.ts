import { NextResponse } from "next/server";
import { applyWebhookEvent, verifyResendWebhook } from "@/lib/email/webhook";

/** Resend-webhook voor bezorgstatussen (spec 11 §4.11). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 404 });

  const body = await request.text();
  let event;
  try {
    event = verifyResendWebhook({
      body,
      id: request.headers.get("svix-id"),
      timestamp: request.headers.get("svix-timestamp"),
      signature: request.headers.get("svix-signature"),
      secret,
    });
  } catch (error) {
    console.warn("[e-mail] webhook geweigerd", { code: error instanceof Error ? error.message : "invalid_signature" });
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  try {
    const { updated } = await applyWebhookEvent(event);
    return NextResponse.json({ ok: true, updated });
  } catch (error) {
    console.error("[e-mail] webhook verwerken mislukt", { pgCode: (error as { pgCode?: string }).pgCode });
    return NextResponse.json({ error: "database" }, { status: 500 });
  }
}
