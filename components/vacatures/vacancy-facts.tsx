import {
  Award,
  CalendarDays,
  CirclePlay,
  Clock,
  Euro,
  FileText,
  Hash,
  Languages,
  MapPin,
  Users,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { QUALIFICATIONS, type Qualification } from "@/lib/data/options";
import type { VacancyDetail } from "@/lib/data/types";
import { Card } from "@/components/ui/card";
import { getVacancyFormatters } from "./vacancy-format";

type Props = {
  vacancy: VacancyDetail;
  locale: Locale;
  variant?: "full" | "compact";
  headingId?: string;
};

/** Alleen bekende kwalificaties (QUALIFICATIONS, zonder "dav" sinds spec 10 VR-13) hebben een naam in messages. */
const isNamed = (q: string): q is Qualification => (QUALIFICATIONS as readonly string[]).includes(q);

/**
 * Kenmerkenblok (spec 06 §4.9): een <dl> in vaste volgorde; een rij zonder
 * waarde vervalt. Telefoon: één kolom, label links; vanaf sm twee kolommen.
 */
export async function VacancyFacts({ vacancy: v, locale, variant = "full", headingId = "kenmerken" }: Props) {
  const [f, t] = await Promise.all([
    getVacancyFormatters(locale),
    getTranslations({ locale, namespace: "vacatures.facts" }),
  ]);
  const full = variant === "full";
  const dutch = locale === "en" ? "nl" : undefined;

  const qualificationItems = [
    ...v.requiredQualifications.filter(isNamed).map((q) => t("qualifications.required", { name: t(`qualificationNames.${q}`) })),
    ...v.preferredQualifications.filter(isNamed).map((q) => t("qualifications.preferred", { name: t(`qualificationNames.${q}`) })),
    ...v.trainingOffered.filter(isNamed).map((q) => t("qualifications.training", { name: t(`qualificationNames.${q}`) })),
  ];

  const place = [v.locationLabel ?? f.city(v.city), v.postalCode].filter(Boolean).join(", ");
  const rows: { key: string; icon: LucideIcon; label: string; value: ReactNode }[] = [
    { key: "city", icon: MapPin, label: t("labels.city"), value: <span lang={v.locationLabel ? dutch : undefined}>{place}</span> },
    {
      key: "wage",
      icon: Euro,
      label: t("labels.wage"),
      value: (
        <>
          <span className="font-semibold">{f.wage(v.salaryMin, v.salaryMax)}</span>
          {v.salaryNote && (
            <span lang={dutch} className="mt-0.5 block text-sm font-normal text-muted-foreground">
              {v.salaryNote}
            </span>
          )}
        </>
      ),
    },
    { key: "hours", icon: Clock, label: t("labels.hours"), value: f.hours(v.hoursMin, v.hoursMax) },
    { key: "contract", icon: FileText, label: t("labels.contract"), value: t(`contract.${v.contractType}`) },
    { key: "shifts", icon: CalendarDays, label: t("labels.shifts"), value: f.shifts(v.shifts) },
  ];
  if (full) rows.push({ key: "start", icon: CirclePlay, label: t("labels.start"), value: f.start(v.startAsap, v.startDate) });
  rows.push({
    key: "qualifications",
    icon: Award,
    label: t("labels.qualifications"),
    value:
      qualificationItems.length > 0 ? (
        <ul role="list" className="grid gap-0.5">
          {qualificationItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        t("qualifications.none")
      ),
  });
  if (v.workplaceLanguage) {
    rows.push({ key: "language", icon: Languages, label: t("labels.language"), value: t(`languageOptions.${v.workplaceLanguage}`) });
  }
  if (full) {
    rows.push({
      key: "experience",
      icon: BadgeCheck,
      label: t("labels.experience"),
      value:
        v.experienceLevel === "required" && v.experienceMonths
          ? t("experience.requiredMonths", { months: v.experienceMonths })
          : t(`experience.${v.experienceLevel}`),
    });
    if (v.positionsCount >= 2) {
      rows.push({ key: "positions", icon: Users, label: t("labels.positions"), value: t("positions", { count: v.positionsCount }) });
    }
  }
  rows.push({ key: "number", icon: Hash, label: t("labels.number"), value: <span className="tabular-nums">{v.number}</span> });

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {t("heading")}
      </h2>
      <Card variant="muted" className="p-5 md:p-6">
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] content-start gap-3 sm:grid-cols-1 sm:gap-1">
              <dt className="flex items-start gap-2 text-sm text-muted-foreground">
                <row.icon className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                <span>{row.label}</span>
              </dt>
              <dd className="min-w-0 font-medium text-foreground sm:pl-6">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </section>
  );
}
