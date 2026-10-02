import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { createElement } from "react";
import { render, toPlainText } from "@react-email/components";
import { EMAIL_TEMPLATES } from "@/emails";
import { PREVIEW_VARIANTS, previewProps } from "@/emails/previews";
import { EMAIL_TEMPLATE_NAMES } from "@/lib/email/types";

// Alle templates in elke toegestane taal en variant (spec 11 §10 stap 12).
describe("mailtemplates", () => {
  for (const name of EMAIL_TEMPLATE_NAMES) {
    const entry = EMAIL_TEMPLATES[name];
    for (const locale of entry.locales) {
      for (const variant of PREVIEW_VARIANTS) {
        it(`${name} ${locale} ${variant}`, async () => {
          const props = previewProps(name, locale, variant);
          const html = await render(createElement(entry.Component, props));
          const text = toPlainText(html);
          const subject = entry.subject(props);
          for (const output of [text, subject]) {
            assert.equal(/[{}]/.test(output), false, "open plaatshouder");
            assert.equal(output.includes("!"), false, "uitroepteken");
            assert.equal(/[–—]/.test(output), false, "gedachtestreepje");
            assert.equal(output.includes(" - "), false, "streepje tussen zinsdelen");
            assert.equal(output.includes("GEHEIME TESTTEKST"), false);
          }
          if (locale === "nl") assert.equal(/\bwe\b/i.test(text), false, "we in nl");
          assert.ok(html.includes(`lang="${locale}"`));
          assert.ok(subject.length < 150);
          assert.equal(/attachment/i.test(html), false);
          const reference = (props as { reference?: string }).reference;
          if (reference) assert.ok(text.includes(reference));
        });
      }
    }
  }

  it("toont binnen één werkdag alleen met de claim (AC-11-13)", async () => {
    for (const name of ["application-confirmation", "registration-confirmation", "staff-request-confirmation"] as const) {
      const entry = EMAIL_TEMPLATES[name];
      const plain = toPlainText(await render(createElement(entry.Component, previewProps(name, "nl"))));
      const claims = toPlainText(await render(createElement(entry.Component, previewProps(name, "nl", "claims"))));
      assert.equal(plain.includes("binnen één werkdag"), false);
      assert.ok(claims.includes("binnen één werkdag"));
    }
  });

  it("laat de bedrijfsnaam weg die geen safeEcho doorstaat", async () => {
    const entry = EMAIL_TEMPLATES["staff-request-confirmation"];
    const props = { ...previewProps("staff-request-confirmation", "nl"), companyName: null };
    const text = toPlainText(await render(createElement(entry.Component, props)));
    assert.equal(text.includes("Bedrijf:"), false);
  });
});
