import { MessageCircle, Phone, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";
import { contact, whatsappLink } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";

type Props = { vacancy: VacancyDetail; locale: Locale };

/**
 * Solliciteer direct, App ons en Bel ons, op het hoofdnummer (spec 06 §4.10, B-60).
 * Telefoon: de hoofdknop over de volle breedte, appen en bellen eronder naast
 * elkaar zodra ze passen (flex-wrap), zodat de vacaturetekst eerder in beeld komt.
 */
export async function VacancyActions({ vacancy, locale }: Props) {
  const [t, tc, tw, ta, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.detail" }),
    getTranslations({ locale, namespace: "common.cta" }),
    getTranslations({ locale, namespace: "common.whatsapp" }),
    getTranslations({ locale, namespace: "common.a11y" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const showWhatsapp = vacancy.state === "open" && vacancy.allowWhatsappApply;

  return (
    <div role="group" aria-label={t("actionsLabel")} className="flex flex-wrap gap-3">
      <CtaButton href="#solliciteren" size="lg" className="w-full sm:w-auto">
        <Send aria-hidden="true" />
        {tc("apply")}
      </CtaButton>
      {showWhatsapp && (
        <CtaButton
          href={whatsappLink(tw("vacatureSolliciteren", { title: vacancy.title, number: vacancy.number }))}
          variant="secondary"
          size="lg"
          external
          newTabLabel={tCommon("opensInNewTab")}
          className="flex-1 px-4 sm:flex-none sm:px-7"
        >
          <MessageCircle aria-hidden="true" />
          {tc("whatsapp")}
        </CtaButton>
      )}
      <CtaButton
        href={contact.phoneHref}
        variant="secondary"
        size="lg"
        ariaLabel={ta("call", { phone: contact.phone })}
        className="flex-1 px-4 sm:flex-none sm:px-7"
      >
        <Phone aria-hidden="true" />
        {tc("call")}
      </CtaButton>
    </div>
  );
}
