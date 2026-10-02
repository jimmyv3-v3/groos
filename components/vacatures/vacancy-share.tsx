import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";
import { CtaButton } from "@/components/ui/cta-button";
import { CopyLinkButton } from "./copy-link-button";
import { NativeShareButton } from "./native-share-button";
import { displayCity } from "./vacancy-format";

type Props = { vacancy: VacancyDetail; locale: Locale; url: string };

/** Delen via WhatsApp, link kopiëren en systeemdelen (spec 06 §4.10). Geen externe scripts. */
export async function VacancyShare({ vacancy, locale, url }: Props) {
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.detail.share" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const tSections = await getTranslations({ locale, namespace: "vacatures.detail.sections" });
  const city = displayCity(vacancy.city, locale);
  const text = t("whatsappText", { title: vacancy.title, city, url });

  return (
    <section aria-labelledby="vacature-delen">
      <h2 id="vacature-delen" className="text-h3 sm:text-[1.5rem]">
        {tSections("share")}
      </h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
        <CtaButton href={`https://wa.me/?text=${encodeURIComponent(text)}`} variant="secondary" external>
          <MessageCircle aria-hidden="true" />
          {t("whatsapp")}
          <span className="sr-only"> {tCommon("opensInNewTab")}</span>
        </CtaButton>
        <CopyLinkButton
          url={url}
          labels={{ copy: t("copy"), copied: t("copied"), failed: t("failed"), linkLabel: t("linkLabel") }}
        />
        <NativeShareButton url={url} title={vacancy.title} text={text} label={t("native")} />
      </div>
    </section>
  );
}
