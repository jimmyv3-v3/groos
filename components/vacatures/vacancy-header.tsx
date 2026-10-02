import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { MAX_BADGES } from "./constants";
import { getVacancyFormatters, isNewVacancy } from "./vacancy-format";

type Props = { vacancy: VacancyDetail; locale: Locale; closed?: boolean };

/** Kop van de vacature: h1, nummer en plaatsingsdatum, badges (spec 06 §4.10). */
export async function VacancyHeader({ vacancy, locale, closed = false }: Props) {
  const [f, t, tc] = await Promise.all([
    getVacancyFormatters(locale),
    getTranslations({ locale, namespace: "vacatures.detail" }),
    getTranslations({ locale, namespace: "vacatures.card" }),
  ]);
  const badges: { key: string; label: string; tone: "warning" | "brand" }[] = [];
  if (!closed && vacancy.state === "open") {
    if (vacancy.isUrgent) badges.push({ key: "urgent", label: tc("badges.urgent"), tone: "warning" });
    if (isNewVacancy(vacancy.publishedAt)) badges.push({ key: "new", label: tc("badges.new"), tone: "brand" });
  }

  return (
    <header className="grid gap-4">
      {badges.length > 0 && (
        <p className="flex flex-wrap gap-2">
          {badges.slice(0, MAX_BADGES).map((b) => (
            <Badge key={b.key} tone={b.tone} size="md">
              {b.label}
            </Badge>
          ))}
        </p>
      )}
      <h1 id="vacature-titel" lang={locale === "en" ? "nl" : undefined}>
        {t("heading", { title: vacancy.title, city: f.city(vacancy.city) })}
      </h1>
      <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="tabular-nums">{t("number", { number: vacancy.number })}</span>
        <span aria-hidden="true">·</span>
        <span>{t("postedOn", { date: f.date(vacancy.publishedAt) })}</span>
      </p>
    </header>
  );
}
