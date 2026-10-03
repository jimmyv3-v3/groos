import { CircleOff } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";
import { Alert } from "@/components/ui/alert";
import { getVacancyFormatters } from "./vacancy-format";

type Props = { vacancy: VacancyDetail; locale: Locale };

/**
 * Melding bij een gesloten vacature (spec 06 §4.10): tekst en icoon, nooit
 * alleen kleur. De h2 staat in de inhoud van de Alert, omdat de Alert van
 * spec 02 (nog) geen titleAs kent; de section met aria-labelledby is al een
 * regio, dus geen role="region".
 */
export async function VacancyClosedNotice({ vacancy, locale }: Props) {
  const [f, t] = await Promise.all([
    getVacancyFormatters(locale),
    getTranslations({ locale, namespace: "vacatures.detail.closed" }),
  ]);
  const variant = vacancy.closeReason === "filled" ? "filled" : "other";

  return (
    <section aria-labelledby="vacature-gesloten-titel">
      <Alert tone="warning" icon={CircleOff} className="px-5 py-4">
        <h2 id="vacature-gesloten-titel" className="text-h3 text-warning-strong">
          {t(`${variant}.title`)}
        </h2>
        <p className="mt-1 text-foreground">{t(`${variant}.body`)}</p>
        {vacancy.closedAt && (
          <p className="mt-1 text-sm text-warning-strong">{t("closedOn", { date: f.date(vacancy.closedAt) })}</p>
        )}
      </Alert>
    </section>
  );
}
