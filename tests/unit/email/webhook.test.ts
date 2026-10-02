import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { verifyResendWebhook } from "@/lib/email/webhook";
import { POST } from "@/app/api/webhooks/resend/route";

const SECRET = `whsec_${Buffer.from("testsleutel-voor-groos").toString("base64")}`;
const body = JSON.stringify({ type: "email.bounced", created_at: "2026-10-02T12:00:00Z", data: { email_id: "abc" } });

function sign(payload: string, timestamp: number, secret = SECRET) {
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  return `v1,${createHmac("sha256", key).update(`msg_1.${timestamp}.${payload}`).digest("base64")}`;
}

describe("verifyResendWebhook", () => {
  const now = Date.now();
  const ts = Math.floor(now / 1000);

  it("accepteert een geldig getekende payload", () => {
    const event = verifyResendWebhook({ body, id: "msg_1", timestamp: String(ts), signature: sign(body, ts), secret: SECRET, now });
    assert.equal(event.type, "email.bounced");
  });

  it("weigert een gewijzigde body, een verkeerde sleutel en een oude tijd", () => {
    assert.throws(
      () => verifyResendWebhook({ body: body + " ", id: "msg_1", timestamp: String(ts), signature: sign(body, ts), secret: SECRET, now }),
      /invalid_signature/,
    );
    const other = `whsec_${Buffer.from("andere").toString("base64")}`;
    assert.throws(
      () => verifyResendWebhook({ body, id: "msg_1", timestamp: String(ts), signature: sign(body, ts, other), secret: SECRET, now }),
      /invalid_signature/,
    );
    const old = ts - 600;
    assert.throws(
      () => verifyResendWebhook({ body, id: "msg_1", timestamp: String(old), signature: sign(body, old), secret: SECRET, now }),
      /stale_timestamp/,
    );
  });
});

describe("POST /api/webhooks/resend", () => {
  it("geeft 404 zonder secret en 401 bij een ongeldige handtekening", async () => {
    delete process.env.RESEND_WEBHOOK_SECRET;
    const res404 = await POST(new Request("http://localhost/api/webhooks/resend", { method: "POST", body }));
    assert.equal(res404.status, 404);
    process.env.RESEND_WEBHOOK_SECRET = SECRET;
    const res401 = await POST(
      new Request("http://localhost/api/webhooks/resend", {
        method: "POST",
        body,
        headers: { "svix-id": "msg_1", "svix-timestamp": String(Math.floor(Date.now() / 1000)), "svix-signature": "v1,fout" },
      }),
    );
    assert.equal(res401.status, 401);
    delete process.env.RESEND_WEBHOOK_SECRET;
  });
});
