import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { getVacancyByNumber, listOpenVacancyParams } from "@/lib/data/vacancies";
import { parseVacancySlug } from "@/lib/data/vacancy-search-params";
import { paths, ROUTES } from "@/lib/routes";
import { absoluteUrl, jobPostingLd, localizedPath, vacancyMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { ApplySection } from "@/components/forms/apply-section";
import { OnlyDutchNotice } from "@/components/vacatures/only-dutch-notice";
import { SimilarVacancies } from "@/components/vacatures/similar-vacancies";
import { VacancyActions } from "@/components/vacatures/vacancy-actions";
import { VacancyApplyAside } from "@/components/vacatures/vacancy-apply-aside";
import { VacancyBody } from "@/components/vacatures/vacancy-body";
import { VacancyClosedNotice } from "@/components/vacatures/vacancy-closed-notice";
import { VacancyContactCard } from "@/components/vacatures/vacancy-contact-card";
import { VacancyFacts } from "@/components/vacatures/vacancy-facts";
import {
  getVacancyMetaValues,
  lowerFirst,
  resolveVacancyContact,
} from "@/components/vacatures/vacancy-format";
import { VacancyHeader } from "@/components/vacatures/vacancy-header";
import { VacancyHowTo } from "@/components/vacatures/vacancy-how-to";
import { VacancyListSkeleton } from "@/components/vacatures/vacancy-list-skeleton";
import { VacancyRegisterPrompt } from "@/components/vacatures/vacancy-register-prompt";
import { VacancyShare } from "@/components/vacatures/vacancy-share";
import { SIMILAR_LIMIT } from "@/components/vacatures/constants";

// ISR (B-35): open vacatures worden per taal voorgebouwd, nieuwe bij het eerste bezoek.
// Geen loading.tsx en geen searchParams: notFound() en de 308 moeten vóór elke stream vallen.
// Metadata via vacancyMetadata() uit lib/seo.ts, die pageMetadata() aanroept (spec 12 §4.3).
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return listOpenVacancyParams();
}

export async function generateMetadata({ params }: PageProps<"/[locale]/vacatures/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const number = parseVacancySlug(slug);
  const vacancy = number ? await getVacancyByNumber(number) : null;
  if (!vacancy) return {};
  const [t, values] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.meta" }),
    getVacancyMetaValues(vacancy, locale),
  ]);
  return vacancyMetadata({
    locale,
    vacancy,
    t: (key, v) => t(key, v),
    city: values.city,
    hours: values.hours,
    wage: values.wage,
    startDate: values.startDate,
  });
}

export default async function VacancyPage({ params }: PageProps<"/[locale]/vacatures/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const number = parseVacancySlug(slug);
  if (number === null) notFound();
  const vacancy = await getVacancyByNumber(number); // React cache(): één lezing met generateMetadata
  if (!vacancy) notFound();
  if (vacancy.slug !== slug) permanentRedirect(localizedPath(locale, vacancy.path)); // 308 (B-15)

  const [t, tn, tb] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.detail" }),
    getTranslations({ locale, namespace: "header.nav" }),
    getTranslations({ locale, namespace: "beroepen" }),
  ]);
  const occupationName = lowerFirst(tb(`${vacancy.occupation.slug}.enkelvoud`), locale);
  const crumbs = [
    { label: tn("vacatures"), href: ROUTES.vacatures },
    { label: vacancy.title, href: vacancy.path },
  ];
  const similar = (
    <Suspense fallback={<VacancyListSkeleton count={SIMILAR_LIMIT} variant="compact" />}>
      <SimilarVacancies number={vacancy.number} locale={locale} headingId="vergelijkbare-vacatures" />
    </Suspense>
  );

  if (vacancy.state === "closed") {
    return (
      <div className="container pt-6 pb-16 sm:pt-8 sm:pb-24">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 max-w-4xl">
          <OnlyDutchNotice locale={locale} />
        </div>
        <article aria-labelledby="vacature-titel" className="mt-6 grid max-w-4xl gap-6 sm:mt-8">
          <VacancyHeader vacancy={vacancy} locale={locale} closed />
          <VacancyClosedNotice vacancy={vacancy} locale={locale} />
          <VacancyFacts vacancy={vacancy} locale={locale} variant="compact" />
        </article>
        <div id="solliciteren" className="mt-14 grid scroll-mt-24 gap-12">
          {similar}
          <VacancyRegisterPrompt locale={locale} headingId="vacature-inschrijven" />
          <p>
            <Link
              href={paths.vacaturesVoorBeroep(vacancy.occupation.slug)}
              className="link inline-flex min-h-11 items-center gap-1.5 font-medium"
            >
              {t("closed.occupationLink", { occupation: occupationName })}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const [values, contact] = [await getVacancyMetaValues(vacancy, locale), resolveVacancyContact(vacancy)];
  const ld =
    locale === "nl"
      ? jobPostingLd({
          vacancy,
          labels: {
            tasks: t("sections.tasks"),
            requirements: t("sections.requirements"),
            offer: t("sections.offer"),
            extra: t("sections.extra"),
          },
          facts: [values.hours, values.wage, values.startSentence],
          minAgeSentence: vacancy.minAge18 && vacancy.minAgeReason ? t(`minAge.${vacancy.minAgeReason}`) : null,
        })
      : null;
  const shareUrl = absoluteUrl(localizedPath(locale, vacancy.path));

  return (
    <div className="container pt-6 pb-16 sm:pt-8 sm:pb-24">
      <Breadcrumbs items={crumbs} />
      {locale === "en" && (
        <div className="mt-6 max-w-4xl">
          <OnlyDutchNotice locale={locale} />
        </div>
      )}
      <article aria-labelledby="vacature-titel" className="mt-6 sm:mt-8">
        <div className="grid max-w-4xl gap-6">
          <VacancyHeader vacancy={vacancy} locale={locale} />
          <VacancyFacts vacancy={vacancy} locale={locale} variant="full" />
          <VacancyActions vacancy={vacancy} locale={locale} contact={contact} />
        </div>
        <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="grid min-w-0 gap-12 lg:col-span-8">
            <div className="grid gap-8">
              <p className="text-lead text-foreground" lang={locale === "en" ? "nl" : undefined}>
                {vacancy.intro}
              </p>
              {vacancy.imageUrl && (
                <Image
                  src={vacancy.imageUrl}
                  alt={t("imageAlt", { title: vacancy.title, city: values.city })}
                  width={1280}
                  height={720}
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="aspect-video w-full rounded-2xl object-cover"
                />
              )}
              <VacancyBody vacancy={vacancy} locale={locale} />
            </div>
            <VacancyHowTo locale={locale} />
            <ApplySection vacancy={vacancy} locale={locale} />
            <VacancyContactCard vacancy={vacancy} locale={locale} contact={contact} />
            <VacancyShare vacancy={vacancy} locale={locale} url={shareUrl} />
          </div>
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24">
              <VacancyApplyAside vacancy={vacancy} locale={locale} contact={contact} />
            </div>
          </aside>
        </div>
      </article>
      <div className="mt-16 grid gap-12">
        {similar}
        <VacancyRegisterPrompt locale={locale} headingId="vacature-inschrijven" />
        <p>
          <Link
            href={paths.werkenAls(vacancy.occupation.slug)}
            className="link inline-flex min-h-11 items-center gap-1.5 font-medium"
          >
            {t("occupationPageLink", { occupation: occupationName })}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </p>
      </div>
      {ld && <JsonLd data={ld} />}
    </div>
  );
}
