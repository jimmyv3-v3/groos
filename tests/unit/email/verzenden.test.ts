import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { createElement } from "react";
import ContactConfirmation from "@/emails/contact-confirmation";
import { previewProps } from "@/emails/previews";
import { EMAIL_FROM_DEFAULT, emailMode } from "@/lib/email/config";
import { resetResendClientForTests, sendEmail } from "@/lib/email/send";

// Zonder SUPABASE_SECRET_KEY faalt het schrijven in email_log; sendEmail mag dan niet gooien.
delete process.env.SUPABASE_SECRET_KEY;

describe("emailMode (spec 11 §4.4)", () => {
  it("volgt de tabel", () => {
    assert.deepEqual(emailMode({ VERCEL_ENV: "production" } as unknown as NodeJS.ProcessEnv), {
      mode: "misconfigured",
      error: "RESEND_API_KEY ontbreekt",
    });
    assert.deepEqual(emailMode({} as unknown as NodeJS.ProcessEnv), { mode: "console", reason: "no_key", onVercel: false });
    assert.deepEqual(
      emailMode({ RESEND_API_KEY: "re_x", VERCEL_ENV: "production", EMAIL_DEV_TO: "d@example.com", EMAIL_FROM: "x <x@example.com>" } as unknown as NodeJS.ProcessEnv),
      { mode: "send", from: EMAIL_FROM_DEFAULT },
    );
    assert.deepEqual(
      emailMode({ RESEND_API_KEY: "re_x", EMAIL_DEV_TO: "d@example.com", EMAIL_FROM: "Test <t@example.com>" } as unknown as NodeJS.ProcessEnv),
      { mode: "redirect", from: "Test <t@example.com>", devTo: "d@example.com" },
    );
    assert.deepEqual(emailMode({ RESEND_API_KEY: "re_x", EMAIL_DEV_TO: "geen" } as unknown as NodeJS.ProcessEnv), {
      mode: "console",
      reason: "no_dev_to",
      onVercel: false,
    });
  });
});

const input = () => ({
  template: "contact-confirmation" as const,
  to: ["Test.Kandidaat@example.com"],
  subject: "Wij hebben uw bericht ontvangen",
  react: createElement(ContactConfirmation, previewProps("contact-confirmation", "nl") as never),
  entity: { type: "contact_message" as const, id: "00000000-0000-4000-8000-000000000001" },
});

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_DEV_TO;
  resetResendClientForTests();
});

function mockResend(statuses: number[]) {
  const calls: { body: Record<string, unknown> }[] = [];
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    if (!String(url).includes("api.resend.com")) return realFetch(url, init);
    calls.push({ body: JSON.parse(String(init?.body)) });
    const status = statuses[Math.min(calls.length - 1, statuses.length - 1)];
    const payload = status === 200 ? { id: "re_123" } : { name: "application_error", message: "fout", statusCode: status };
    return new Response(JSON.stringify(payload), { status, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return calls;
}

describe("sendEmail", () => {
  it("schrijft zonder sleutel naar de console", async () => {
    const calls = mockResend([200]);
    const result = await sendEmail(input());
    assert.deepEqual(result, { status: "console" });
    assert.equal(calls.length, 0);
  });

  it("stuurt met sleutel alleen naar EMAIL_DEV_TO met [test voor ...]", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_DEV_TO = "dev@example.com";
    const calls = mockResend([200]);
    const result = await sendEmail(input());
    assert.deepEqual(result, { status: "sent", providerId: "re_123" });
    assert.deepEqual(calls[0].body.to, ["dev@example.com"]);
    assert.match(String(calls[0].body.subject), /^\[test voor test\.kandidaat@example\.com\] /);
    assert.equal("attachments" in calls[0].body, false);
  });

  it("probeert na een 500 één keer opnieuw", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_DEV_TO = "dev@example.com";
    const calls = mockResend([500, 200]);
    const result = await sendEmail(input());
    assert.equal(result.status, "sent");
    assert.equal(calls.length, 2);
  });

  it("geeft failed na twee keer 500 en gooit nooit", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_DEV_TO = "dev@example.com";
    const calls = mockResend([500, 500]);
    const result = await sendEmail(input());
    assert.equal(result.status, "failed");
    assert.equal(calls.length, 2);
  });

  it("weigert zonder geldige ontvanger", async () => {
    const result = await sendEmail({ ...input(), to: ["geen-adres"] });
    assert.deepEqual(result, { status: "failed", error: "geen geldige ontvanger" });
  });
});
