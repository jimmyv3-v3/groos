"use client";

import { useTranslations } from "next-intl";
import { contact, whatsappLink } from "@/lib/site";
import type { FormId } from "@/lib/validation/shared";
import { TrackedContactLink } from "../tracked-contact-link";

/** Bel- en WhatsApp-knop onder een globale fout (spec 07 §8, Fouten). */
export function FormContactLinks({ form, whatsappText }: { form: FormId; whatsappText: string }) {
  const t = useTranslations("common");
  return (
    <>
      <TrackedContactLink
        kind="call"
        form={form}
        href={contact.phoneHref}
        label={t("cta.call")}
        ariaLabel={t("a11y.callPerson", { name: contact.shortName, phone: contact.phone })}
        className="h-11 px-4 text-sm"
      />
      <TrackedContactLink
        kind="whatsapp"
        form={form}
        href={whatsappLink(whatsappText)}
        label={t("cta.whatsapp")}
        ariaLabel={t("cta.whatsapp")}
        external
        newTabLabel={t("opensInNewTab")}
        className="h-11 px-4 text-sm"
      />
    </>
  );
}
