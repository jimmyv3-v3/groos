import { CalendarDays, CirclePlay, Clock, Euro, MapPin, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { VacancyListItem } from "@/lib/data/types";
import { cn } from "@/lib/utils";
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
 * Vacaturekaart (spec 06 §4.7): titel als uitgerekte link, kenmerkregels met
 * icoon, hoogstens twee badges. Eén link per kaart, geen beeld (B-25).
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
  // VacancyListItem heeft (nog) geen startmoment; spec 10 levert startAsap en startDate.
  const item = vacancy as VacancyListItem & { startAsap?: boolean; startDate?: string | null };
  const start = f.start(item.startAsap ?? true, item.startDate ?? null);

  const badges: { key: string; label: string; tone: "warning" | "brand" }[] = [];
  if (vacancy.state === "open") {
    if (vacancy.isUrgent) badges.push({ key: "urgent", label: t("badges.urgent"), tone: "warning" });
    if (isNewVacancy(vacancy.publishedAt, now)) badges.push({ key: "new", label: t("badges.new"), tone: "brand" });
  }

  const rows: { key: string; icon: LucideIcon; label: string; value: string; strong?: boolean }[] = [
    { key: "city", icon: MapPin, label: t("cityLabel"), value: city },
    { key: "wage", icon: Euro, label: t("wageLabel"), value: wage, strong: true },
    { key: "hours", icon: Clock, label: t("hoursLabel"), value: hours },
    { key: "shifts", icon: CalendarDays, label: t("shiftsLabel"), value: shifts },
    { key: "start", icon: CirclePlay, label: t("startLabel"), value: start },
  ];

  return (
    <Card variant="interactive" className="h-full gap-3 p-5 md:p-5">
      <div className="flex flex-col gap-2">
        <Heading className="text-h3">
          <Link
            href={vacancy.path}
            lang={dutch}
            aria-label={t("ariaLabel", { title: vacancy.title, city, wage, hours, start })}
            className="rounded-sm text-foreground outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-brand-strong"
          >
            {vacancy.title}
          </Link>
        </Heading>
        {badges.length > 0 && (
          <p className="flex flex-wrap gap-2">
            {badges.slice(0, MAX_BADGES).map((b) => (
              <Badge key={b.key} tone={b.tone}>
                {b.label}
              </Badge>
            ))}
          </p>
        )}
      </div>
      <dl className="grid gap-1.5 text-sm">
        {rows.map((row) => (
          <div key={row.key} className="flex min-w-0">
            <dt className="sr-only">{row.label}</dt>
            <dd
              className={cn(
                "flex min-w-0 items-start gap-2.5",
                row.strong ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              <row.icon className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
              <span className="min-w-0">{row.value}</span>
            </dd>
          </div>
        ))}
      </dl>
      {variant === "default" && vacancy.summary && (
        <p lang={dutch} className="line-clamp-2 text-sm text-muted-foreground">
          {vacancy.summary}
        </p>
      )}
    </Card>
  );
}
