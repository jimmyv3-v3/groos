import assert from "node:assert/strict";
import { beforeEach, describe, it, vi } from "vitest";
import type { SendEmailInput } from "@/lib/email/types";

// Statusmails vanuit het beheer en de melding bij een mail die niet aankomt,
// met een nep-database en een nep-sendEmail. Er gaat niets naar Supabase of Resend.

const sent: SendEmailInput[] = [];
let tables: Record<string, unknown> = {};
let sendStatus: "console" | "failed" = "console";
const updates: { table: string; filters: [string, string, unknown][] }[] = [];

vi.mock("@/lib/email/send", () => ({
  sendEmail: vi.fn(async (input: SendEmailInput) => {
    sent.push(input);
    return sendStatus === "failed" ? { status: "failed", error: "test" } : { status: "console" };
  }),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({
    from(table: string) {
      const result = { data: tables[table] ?? null, error: null };
      const filters: [string, string, unknown][] = [];
      const builder: Record<string, unknown> = {};
      for (const method of ["select", "order"]) builder[method] = () => builder;
      for (const method of ["eq", "neq", "in"]) {
        builder[method] = (column: string, value: unknown) => {
          filters.push([method, column, value]);
          return builder;
        };
      }
      builder.update = () => {
        updates.push({ table, filters });
        return builder;
      };
      builder.single = async () => result;
      builder.then = (resolve: (value: typeof result) => unknown) => resolve(result);
      return builder;
    },
  }),
}));

const { sendApplicationStatusEmail } = await import("@/lib/email/beheer");
const { sendDeliveryFailureAlerts } = await import("@/lib/email/alerts");
const { applyWebhookEvent } = await import("@/lib/email/webhook");
const { applicationStatusSchema } = await import("@/app/beheer/_lib/validation/application");

const ID = "00000000-0000-4000-8000-000000000010";

function application(overrides: Record<string, unknown> = {}) {
  return {
    id: ID,
    reference: "S-2026-0001",
    kind: "vacancy",
    first_name: "Test",
    email: "test.kandidaat@example.com",
    locale: "nl",
    vacancy_title_snapshot: "Glazenwasser",
    retention_consent: false,
    anonymized_at: null,
    ...overrides,
  };
}

beforeEach(() => {
  sent.length = 0;
  updates.length = 0;
  sendStatus = "console";
  tables = { admin_profiles: [{ email: "planner@example.com" }] };
});

describe("sendApplicationStatusEmail", () => {
  it("stuurt de uitnodiging met datum en tijd in de taal van de kandidaat", async () => {
    tables.applications = application({ locale: "en" });
    const result = await sendApplicationStatusEmail({
      applicationId: ID,
      kind: "invitation",
      meeting: { date: "2026-11-02", time: "14:30" },
    });
    assert.equal(result, "sent");
    assert.equal(sent[0].template, "application-invitation");
    assert.deepEqual(sent[0].to, ["test.kandidaat@example.com"]);
    assert.deepEqual(sent[0].entity, { type: "application", id: ID });
    const props = sent[0].react.props as { locale: string; dateLabel: string; timeLabel: string };
    assert.equal(props.locale, "en");
    assert.equal(props.dateLabel, "Monday, 2 November 2026");
    assert.equal(props.timeLabel, "14:30");
  });

  it("stuurt geen uitnodiging zonder datum en tijd", async () => {
    tables.applications = application();
    assert.equal(await sendApplicationStatusEmail({ applicationId: ID, kind: "invitation" }), "failed");
    assert.equal(sent.length, 0);
  });

  it("kiest het template bij afwijzing en plaatsing, met een eigen sleutel per verzending", async () => {
    tables.applications = application({ retention_consent: true });
    await sendApplicationStatusEmail({ applicationId: ID, kind: "rejection" });
    await sendApplicationStatusEmail({ applicationId: ID, kind: "rejection" });
    await sendApplicationStatusEmail({ applicationId: ID, kind: "placement" });
    assert.deepEqual(
      sent.map((s) => s.template),
      ["application-rejection", "application-rejection", "application-placement"],
    );
    assert.equal((sent[0].react.props as { retentionConsent: boolean }).retentionConsent, true);
    assert.notEqual(sent[0].idempotencyKey, sent[1].idempotencyKey);
  });

  it("laat de vacaturetitel weg bij een inschrijving", async () => {
    tables.applications = application({ kind: "registration", vacancy_title_snapshot: null });
    await sendApplicationStatusEmail({ applicationId: ID, kind: "rejection" });
    assert.equal((sent[0].react.props as { vacancyTitle: string | null }).vacancyTitle, null);
  });

  it("slaat over zonder e-mailadres of na anonimiseren", async () => {
    tables.applications = application({ email: null });
    assert.equal(await sendApplicationStatusEmail({ applicationId: ID, kind: "rejection" }), "skipped");
    tables.applications = application({ anonymized_at: "2026-10-01T00:00:00Z" });
    assert.equal(await sendApplicationStatusEmail({ applicationId: ID, kind: "placement" }), "skipped");
    assert.equal(sent.length, 0);
  });

  it("meldt een mislukte verzending", async () => {
    tables.applications = application();
    sendStatus = "failed";
    assert.equal(await sendApplicationStatusEmail({ applicationId: ID, kind: "placement" }), "failed");
  });
});

describe("sendDeliveryFailureAlerts", () => {
  it("meldt een gebouncete bevestiging aan info@ en de beheerders", async () => {
    tables.applications = { reference: "S-2026-0001" };
    await sendDeliveryFailureAlerts([
      { logId: 7, template: "application-confirmation", entityType: "application", entityId: ID, reason: "bounced" },
    ]);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].template, "delivery-failure-notification");
    assert.deepEqual(sent[0].to, ["info@groospersoneelsdiensten.nl", "planner@example.com"]);
    assert.equal(sent[0].subject, "Een e-mail over S-2026-0001 is niet aangekomen");
    assert.equal(sent[0].idempotencyKey, "delivery-failure-notification/7");
    assert.ok((sent[0].react.props as { beheerLink: string }).beheerLink.endsWith("/beheer/sollicitaties/S-2026-0001"));
  });

  it("meldt geen interne meldingen en geen mails zonder record, zodat er geen lus ontstaat", async () => {
    tables.applications = { reference: "S-2026-0001" };
    await sendDeliveryFailureAlerts([
      { logId: 1, template: "application-notification", entityType: "application", entityId: ID, reason: "bounced" },
      { logId: 2, template: "delivery-failure-notification", entityType: "application", entityId: ID, reason: "bounced" },
      { logId: 3, template: "application-confirmation", entityType: null, entityId: null, reason: "failed" },
    ]);
    assert.equal(sent.length, 0);
  });

  it("noemt bij een contactbericht de naam van de afzender", async () => {
    tables.contact_messages = { name: "Test Bezoeker" };
    await sendDeliveryFailureAlerts([
      { logId: 9, template: "contact-confirmation", entityType: "contact_message", entityId: ID, reason: "suppressed" },
    ]);
    assert.equal(sent[0].subject, "Een e-mail over het bericht van Test Bezoeker is niet aangekomen");
  });
});

describe("applyWebhookEvent", () => {
  const event = (type: "email.bounced" | "email.delivered") => ({
    type,
    created_at: "2026-10-03T12:00:00Z",
    data: { email_id: "abc" },
  });

  it("geeft bij een bounce de mislukte mails terug en slaat rijen over die al op bounced staan", async () => {
    tables.email_log = [{ id: 7, template: "application-confirmation", entity_type: "application", entity_id: ID }];
    const result = await applyWebhookEvent(event("email.bounced"));
    assert.equal(result.updated, 1);
    assert.deepEqual(result.failures, [
      { logId: 7, template: "application-confirmation", entityType: "application", entityId: ID, reason: "bounced" },
    ]);
    assert.deepEqual(updates[0].filters, [
      ["eq", "provider_message_id", "abc"],
      ["neq", "status", "bounced"],
    ]);
  });

  it("geeft bij een bezorging geen mislukte mails terug", async () => {
    tables.email_log = [{ id: 7, template: "application-confirmation", entity_type: "application", entity_id: ID }];
    const result = await applyWebhookEvent(event("email.delivered"));
    assert.deepEqual(result.failures, []);
  });
});

describe("applicationStatusSchema", () => {
  const base = { id: ID, status: "invited" as const };

  it("vraagt datum en tijd alleen bij een uitnodiging met e-mail", () => {
    assert.equal(applicationStatusSchema.safeParse(base).success, true);
    assert.equal(applicationStatusSchema.safeParse({ ...base, notify: false }).success, true);
    assert.equal(applicationStatusSchema.safeParse({ id: ID, status: "rejected", notify: true }).success, true);
    const missing = applicationStatusSchema.safeParse({ ...base, notify: true });
    assert.equal(missing.success, false);
    assert.deepEqual(missing.error?.issues.map((i) => i.path[0]).sort(), ["meetingDate", "meetingTime"]);
  });

  it("weigert een datum in het verleden en een ongeldige tijd", () => {
    const past = applicationStatusSchema.safeParse({ ...base, notify: true, meetingDate: "2020-01-01", meetingTime: "25:00" });
    assert.equal(past.success, false);
    assert.equal(past.error?.issues.length, 2);
    const ok = applicationStatusSchema.safeParse({ ...base, notify: true, meetingDate: "2099-01-01", meetingTime: "09:15" });
    assert.equal(ok.success, true);
  });
});
