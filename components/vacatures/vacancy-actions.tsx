import { MessageCircle, Phone, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";
import { whatsappLink } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";
import { asPhone, type ResolvedVacancyContact } from "./vacancy-format";

type Props = { vacancy: VacancyDetail; locale: Locale; contact: ResolvedVacancyContact };

/** Solliciteer direct, App {naam} en Bel {naam} (spec 06 §4.10). */
export async function VacancyActions({ vacancy, locale, contact }: Props) {
  const [t, tc, tw, ta, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.detail" }),
    getTranslations({ locale, namespace: "common.cta" }),
    getTranslations({ locale, namespace: "common.whatsapp" }),
    getTranslations({ locale, namespace: "common.a11y" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const showWhatsapp = vacancy.state === "open" && vacancy.allowWhatsappApply && contact.whatsappE164 !== null;

  return (
    <div role="group" aria-label={t("actionsLabel")} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <CtaButton href="#solliciteren" size="lg">
        <Send aria-hidden="true" />
        {tc("apply")}
      </CtaButton>
      {showWhatsapp && contact.whatsappE164 && (
        <CtaButton
          href={whatsappLink(
            tw("vacatureSolliciteren", { title: vacancy.title, number: vacancy.number }),
            asPhone(contact.whatsappE164),
          )}
          variant="secondary"
          size="lg"
          external
        >
          <MessageCircle aria-hidden="true" />
          {tc("whatsappPerson", { name: contact.name })}
          <span className="sr-only"> {tCommon("opensInNewTab")}</span>
        </CtaButton>
      )}
      <CtaButton
        href={`tel:${contact.phoneE164}`}
        variant="secondary"
        size="lg"
        ariaLabel={ta("callPerson", { name: contact.name, phone: contact.phoneDisplay })}
      >
        <Phone aria-hidden="true" />
        {tc("callPerson", { name: contact.name })}
      </CtaButton>
    </div>
  );
}
