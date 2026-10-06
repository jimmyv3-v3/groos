import { Suspense } from "react";
import { ArrowRight, MessageCircle, SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { BeroepId } from "@/content/beroepen";
import { getLatestVacancies, getOpenVacancyCount, getVacanciesByOccupation } from "@/lib/data/vacancies";
import type { VacancyListItem } from "@/lib/data/types";
import { ROUTES, paths } from "@/lib/routes";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { IconTile } from "@/components/ui/icon-tile";
import { CtaLinks } from "@/components/service/cta-links";
import { VacancyList } from "@/components/vacatures/vacancy-list";
import { VacancyListSkeleton } from "@/components/vacatures/vacancy-list-skeleton";
import { occupationPhrase } from "@/i18n/occupation-phrase";

export type BeroepVacanciesProps = {
  id?: string;
  beroepId?: BeroepId;
  locale: Locale;
  heading: string;
  accent?: string;
  intro?: string;
  limit?: number;
  empty: { title: string; body: string; whatsappText: string };
  className?: string;
};

/**
 * Live vacatures van één beroep, of de nieuwste drie zonder beroep (spec 05
 * §4.4.5). De kop staat buiten de Suspense-grens, zodat de koppenstructuur vast
 * ligt; het skelet van spec 06 vult de wachttijd. Een fout van de datalaag geeft
 * een melding met een link naar /vacatures, nooit een kapotte pagina.
 */
export function BeroepVacancies({ id = "vacatures", heading, accent, intro, className, ...props }: BeroepVacanciesProps) {
  const limit = props.limit ?? (props.beroepId ? 6 : 3);
  return (
    <section id={id} className={cn("section section-rule scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <div className="mt-10 md:mt-12">
          <Suspense fallback={<VacancyListSkeleton count={3} className="lg:grid-cols-3" />}>
            <VacancyResults {...props} limit={limit} listId={`${id}-lijst`} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function VacancyResults({
  beroepId,
  locale,
  limit,
  empty,
  listId,
}: Omit<BeroepVacanciesProps, "id" | "heading" | "accent" | "intro" | "className"> & { limit: number; listId: string }) {
  const [tb, tc] = await Promise.all([
    getTranslations({ locale, namespace: "beroepen" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  let items: VacancyListItem[];
  let total: number;
  try {
    if (beroepId) {
      ({ items, total } = await getVacanciesByOccupation(beroepId, { limit }));
    } else {
      [items, total] = await Promise.all([getLatestVacancies({ limit }), getOpenVacancyCount()]);
    }
  } catch (error) {
    console.error("[BeroepVacancies] vacatures laden mislukt", error);
    return (
      <p className="max-w-3xl text-base">
        {tb("ui.vacancies.loadError")}{" "}
        <Link href={ROUTES.vacatures} className="link">
          {tb("ui.vacancies.viewAllLinkAll")}
        </Link>
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex max-w-3xl flex-col gap-5 rounded-2xl border border-dashed border-border-strong bg-card p-6 md:p-8">
        <IconTile icon={SearchX} />
        <div>
          <h3 className="text-h3">{empty.title}</h3>
          <p className="mt-2 text-base text-muted-foreground">{empty.body}</p>
        </div>
        <CtaLinks
          ctas={[
            {
              label: tc("cta.register"),
              href: beroepId ? `${ROUTES.inschrijven}?beroep=${beroepId}` : ROUTES.inschrijven,
              variant: "primary",
            },
            {
              label: tc("cta.whatsapp"),
              href: whatsappLink(empty.whatsappText),
              variant: "secondary",
              external: true,
              icon: <MessageCircle aria-hidden="true" />,
            },
          ]}
        />
      </div>
    );
  }

  const occupation = beroepId ? occupationPhrase(tb(`${beroepId}.enkelvoud`), locale) : "";
  const listLabel = beroepId ? tb("ui.vacancies.listLabel", { occupation }) : tb("ui.vacancies.listLabelAll");
  return (
    <>
      <p id={listId} className="sr-only">
        {listLabel}
      </p>
      <VacancyList items={items} locale={locale} headingLevel="h3" ariaLabelledBy={listId} className="lg:grid-cols-3" />
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base text-muted-foreground">{tb("ui.vacancies.count", { count: total })}</p>
        <Link
          href={beroepId ? paths.vacaturesVoorBeroep(beroepId) : ROUTES.vacatures}
          className="link inline-flex min-h-11 items-center gap-2 font-medium"
        >
          {beroepId ? tb("ui.vacancies.viewAllLink") : tb("ui.vacancies.viewAllLinkAll")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
