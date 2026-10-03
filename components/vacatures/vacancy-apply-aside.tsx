import { MessageCircle, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";
import { whatsappLink } from "@/lib/site";
import { Card } from "@/components/ui/card";
import { CtaButton } from "@/components/ui/cta-button";
import { getVacancyFormatters } from "./vacancy-format";

type Props = { vacancy: VacancyDetail; locale: Locale };

/** Vaste sollicitatiebalk op lg en breder (spec 06 §4.10): in het kort, knop en WhatsApp. */
export async function VacancyApplyAside({ vacancy, locale }: Props) {
  const [f, t, tf, tc, tw, tCommon] = await Promise.all([
    getVacancyFormatters(locale),
    getTranslations({ locale, namespace: "vacatures.detail" }),
    getTranslations({ locale, namespace: "vacatures.facts.labels" }),
    getTranslations({ locale, namespace: "common.cta" }),
    getTranslations({ locale, namespace: "common.whatsapp" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const showWhatsapp = vacancy.state === "open" && vacancy.allowWhatsappApply;
  const rows = [
    { key: "wage", label: tf("wage"), value: f.wage(vacancy.salaryMin, vacancy.salaryMax) },
    { key: "hours", label: tf("hours"), value: f.hours(vacancy.hoursMin, vacancy.hoursMax) },
    { key: "start", label: tf("start"), value: f.start(vacancy.startAsap, vacancy.startDate) },
  ];

  return (
    <Card className="gap-5 p-6 md:p-6">
      <h2 id="in-het-kort" className="text-h3">
        {t("aside.heading")}
      </h2>
      <dl className="grid gap-4">
        {rows.map((row) => (
          <div key={row.key}>
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-2">
        <CtaButton href="#solliciteren" className="w-full">
          <Send aria-hidden="true" />
          {tc("apply")}
        </CtaButton>
        {showWhatsapp && (
          <CtaButton
            href={whatsappLink(tw("vacatureSolliciteren", { title: vacancy.title, number: vacancy.number }))}
            variant="secondary"
            className="w-full"
            external
            newTabLabel={tCommon("opensInNewTab")}
          >
            <MessageCircle aria-hidden="true" />
            {tc("whatsapp")}
          </CtaButton>
        )}
      </div>
    </Card>
  );
}
