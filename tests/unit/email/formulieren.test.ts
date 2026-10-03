import assert from "node:assert/strict";
import { beforeEach, describe, it, vi } from "vitest";
import type { SendEmailInput } from "@/lib/email/types";

// De vier functies van spec 11 §4.10 met een nep-database en een nep-sendEmail.
// Er gaat niets naar Supabase of Resend.

const sent: SendEmailInput[] = [];
let tables: Record<string, unknown> = {};

vi.mock("@/lib/email/send", () => ({
  sendEmail: vi.fn(async (input: SendEmailInput) => {
    sent.push(input);
    return { status: "console" };
  }),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({
    from(table: string) {
      const result = { data: tables[table] ?? null, error: null };
      const builder: Record<string, unknown> = {};
      for (const method of ["select", "eq", "in", "order"]) builder[method] = () => builder;
      builder.single = async () => result;
      builder.then = (resolve: (value: typeof result) => unknown) => resolve(result);
      return builder;
    },
  }),
}));

const { sendApplicationEmails, sendContactEmails } = await import("@/lib/email/forms");

function application(contact: Record<string, unknown> | null) {
  return {
    id: "00000000-0000-4000-8000-000000000010",
    reference: "S-2026-0001",
    kind: "vacancy",
    first_name: "Test",
    last_name: "Kandidaat",
    email: "test.kandidaat@example.com",
    phone_e164: "+31612345678",
    city: "Den Haag",
    may_work_in_nl: true,
    available_from: null,
    has_driving_license_b: null,
    message: "GEHEIME TESTTEKST",
    cv_path: null,
    retention_consent: false,
    locale: "nl",
    utm: null,
    vacancy_number: 1001,
    vacancy_title_snapshot: "Glazenwasser",
    anonymized_at: null,
    occupation_slugs: ["glazenwasser"],
    vacancy: { city: "Den Haag", contact },
  };
}

beforeEach(() => {
  sent.length = 0;
  tables = { admin_profiles: [{ email: "Planner@example.com" }, { email: "info@groospersoneelsdiensten.nl" }] };
});

describe("sendApplicationEmails (spec 11 §4.10)", () => {
  it("noemt geen contactpersoon bij naam, ook als de vacature er een heeft (B-60)", async () => {
    tables.applications = application({
      display_name: "Beheerder A",
      phone_e164: "+31611111111",
      whatsapp_e164: "+31611111111",
      is_active: true,
    });
    await sendApplicationEmails({ applicationId: "x" });
    const props = sent[0].react.props as Record<string, unknown> & { company: { phoneDisplay: string } };
    assert.equal(sent[0].template, "application-confirmation");
    assert.equal("contactName" in props, false);
    assert.equal("contactPhoneDisplay" in props, false);
    assert.equal(props.company.phoneDisplay, "06 83 35 19 85");
    assert.equal(JSON.stringify(props).includes("Beheerder A"), false);
    assert.equal(JSON.stringify(props).includes("06 11 11 11 11"), false);
  });

  it("stuurt de interne melding als één mail naar info@ en de beheerders, ontdubbeld en gesorteerd", async () => {
    tables.applications = application(null);
    await sendApplicationEmails({ applicationId: "x" });
    assert.deepEqual(
      sent.map((s) => s.template),
      ["application-confirmation", "application-notification"],
    );
    assert.deepEqual(sent[1].to, ["info@groospersoneelsdiensten.nl", "planner@example.com"]);
    assert.deepEqual(sent[1].entity, { type: "application", id: "00000000-0000-4000-8000-000000000010" });
  });

  it("zet de vrije tekst in geen enkele mail", async () => {
    tables.applications = application(null);
    await sendApplicationEmails({ applicationId: "x" });
    for (const mail of sent) assert.equal(JSON.stringify(mail.react.props).includes("GEHEIME TESTTEKST"), false);
  });
});

describe("sendContactEmails (spec 11 §4.10)", () => {
  it("stuurt zonder e-mailadres alleen de interne melding", async () => {
    tables.contact_messages = {
      id: "00000000-0000-4000-8000-000000000020",
      name: "Test",
      email: null,
      phone_e164: "+31612345678",
      topic: "callback",
      message: null,
      locale: "nl",
      status: "new",
    };
    await sendContactEmails({ contactMessageId: "x" });
    assert.deepEqual(
      sent.map((s) => s.template),
      ["contact-notification"],
    );
  });

  it("stuurt niets bij spam", async () => {
    tables.contact_messages = {
      id: "00000000-0000-4000-8000-000000000021",
      name: "Test",
      email: "test@example.com",
      phone_e164: null,
      topic: "other",
      message: "spam",
      locale: "nl",
      status: "spam",
    };
    await sendContactEmails({ contactMessageId: "x" });
    assert.equal(sent.length, 0);
  });
});
