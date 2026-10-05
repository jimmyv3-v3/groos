import { ArrowUpRight, CalendarDays, CirclePlay, Clock, MapPin, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { VacancyListItem } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MAX_BADGES } from "./constants";
import type { VacancyCardVariant } from "./types";
import { getVacancyFormatters, isNewVacancy } from "./vacancy-format";

type Props = {
  vacancy: VacancyListItem;
  locale: Locale;
  variant?: VacancyCardVariant;
  headingLevel?: "h2" | "h3";
  now?: Date;
};

/**
 * Vacaturekaart (spec 06 §4.7): titel als uitgerekte link, hoogstens twee
 * badges, het uurloon als hoofdfeit en de overige kenmerken met icoon in de
 * voet onder een haarlijn. Eén link per kaart, geen beeld (B-25). De pijl
 * rechtsboven is decoratie en kleurt mee bij hover.
 */
export async function VacancyCard({ vacancy, locale, variant = "default", headingLevel = "h3", now }: Props) {
  const [f, t] = await Promise.all([
    getVacancyFormatters(locale),
    getTranslations({ locale, namespace: "vacatures.card" }),
  ]);
  const Heading = headingLevel;
  const dutch = locale === "en" ? "nl" : undefined;
  const city = f.city(vacancy.city);
  const wage = f.wage(vacancy.salaryMin, vacancy.salaryMax);
  const hours = f.hours(vacancy.hoursMin, vacancy.hoursMax);
  const shifts = f.shifts(vacancy.shifts);
  const start = f.start(vacancy.startAsap, vacancy.startDate);

  const badges: { key: string; label: string; tone: "warning" | "brand" }[] = [];
  if (vacancy.state === "open") {
    if (vacancy.isUrgent) badges.push({ key: "urgent", label: t("badges.urgent"), tone: "warning" });
    if (isNewVacancy(vacancy.publishedAt, now)) badges.push({ key: "new", label: t("badges.new"), tone: "brand" });
  }

  const rows: { key: string; icon: LucideIcon; label: string; value: string }[] = [
    { key: "city", icon: MapPin, label: t("cityLabel"), value: city },
    { key: "hours", icon: Clock, label: t("hoursLabel"), value: hours },
    { key: "shifts", icon: CalendarDays, label: t("shiftsLabel"), value: shifts },
    { key: "start", icon: CirclePlay, label: t("startLabel"), value: start },
  ];

  return (
    <Card variant="interactive" className="group @container h-full gap-0 p-0 md:p-0">
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <Heading className="text-h3">
            <Link
              href={vacancy.path}
              lang={dutch}
              aria-label={t("ariaLabel", { title: vacancy.title, city, wage, hours, start })}
              className="rounded-sm text-foreground outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] group-hover:text-brand-strong"
            >
              {vacancy.title}
            </Link>
          </Heading>
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-brand transition-colors duration-200 ease-brand group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </span>
        </div>
        {badges.length > 0 && (
          <p className="flex flex-wrap gap-2">
            {badges.slice(0, MAX_BADGES).map((b) => (
              <Badge key={b.key} tone={b.tone}>
                {b.label}
              </Badge>
            ))}
          </p>
        )}
        {variant === "default" && vacancy.summary && (
          <p lang={dutch} className="line-clamp-2 text-sm text-muted-foreground">
            {vacancy.summary}
          </p>
        )}
      </div>
      <dl className="border-t border-border px-5 py-4 text-sm md:px-6">
        <div>
          <dt className="sr-only">{t("wageLabel")}</dt>
          <dd className="font-display text-base font-semibold text-foreground tabular-nums">{wage}</dd>
        </div>
        <div className="mt-3 grid gap-x-6 gap-y-1.5 @md:grid-cols-2">
          {rows.map((row) => (
            <div key={row.key} className="flex min-w-0">
              <dt className="sr-only">{row.label}</dt>
              <dd className="flex min-w-0 items-start gap-2.5 text-muted-foreground">
                <row.icon className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                <span className="min-w-0">{row.value}</span>
              </dd>
            </div>
          ))}
        </div>
      </dl>
    </Card>
  );
}
