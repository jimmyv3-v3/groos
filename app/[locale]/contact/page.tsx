import type { Metadata } from "next";
import { Building2, Mail, MapPin, Phone, Clock, UserRound } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactPersonCard } from "@/components/contact/contact-person-card";
import { ContactForm } from "@/components/forms/contact-form";
import { FormErrorBoundary } from "@/components/forms/form-error-boundary";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaButton } from "@/components/ui/cta-button";
import { resolveLocale } from "@/i18n/locale";
import { isClaimConfirmed } from "@/lib/claims";
import { formatTime } from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import { employmentAgencyLd, pageMetadata } from "@/lib/seo";
import { contact, people } from "@/lib/site";

// Contact (spec 07 §4.9): personen, gegevens, keuzeblok en het contactformulier.

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, path: ROUTES.contact, title: t("meta.title"), description: t("meta.description") });
}

function Detail({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand-strong">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="grid gap-0.5">
        <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
        <dd className="text-base text-foreground">{children}</dd>
      </div>
    </div>
  );
}

const linkClasses = "underline-offset-4 hover:text-brand-strong hover:underline";

export default async function Page({ params }: PageProps<"/[locale]/contact">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const [t, tc, tMeta] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "meta" }),
  ]);
  const either = new Intl.ListFormat(locale, { type: "disjunction" }).format(people.map((p) => p.firstName));
  const hours = contact.openingHours;

  return (
    <>
      <JsonLd data={employmentAgencyLd({ locale, description: tMeta("organizationDescription") })} />

      <section className="pt-8 pb-4 sm:pt-12">
        <div className="container">
          <Breadcrumbs items={[{ label: t("breadcrumb"), href: ROUTES.contact }]} className="mb-8" />
          <div className="max-w-3xl">
            <h1 className="text-h1">{t("title")}</h1>
            <p className="mt-5 max-w-[60ch] text-lead text-muted-foreground">{t("intro")}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="personen-titel" className="py-10 sm:py-14">
        <div className="container">
          <h2 id="personen-titel" className="text-h2">
            {t("people.title")} <span className="accent-text">{t("people.accent", { name: either })}</span>
          </h2>
          <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">{t("people.intro")}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:max-w-4xl">
            {people.map((person) => (
              <li key={person.id}>
                <ContactPersonCard person={person} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="gegevens-titel" className="py-10 sm:py-14">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 id="gegevens-titel" className="text-h2">
              {t("details.title")} <span className="accent-text">{t("details.accent")}</span>
            </h2>
            <dl className="mt-8 grid gap-6">
              <Detail icon={MapPin} label={tc("contact.address")}>
                {contact.street}
                <br />
                {contact.postalCode} {contact.city}
                <span className="mt-1 block text-sm text-muted-foreground">{tc("address.byAppointment")}</span>
              </Detail>
              <Detail icon={Mail} label={tc("contact.email")}>
                <a href={contact.emailHref} className={linkClasses}>
                  {contact.email}
                </a>
              </Detail>
              <Detail icon={Phone} label={t("details.phone")}>
                <a href={contact.phoneHref} className={`tabular-nums ${linkClasses}`}>
                  {contact.phone}
                </a>
              </Detail>
              {hours && (
                <Detail icon={Clock} label={tc("contact.officeHours")}>
                  {t("details.officeHoursValue", {
                    opens: formatTime(hours.opens, locale),
                    closes: formatTime(hours.closes, locale),
                  })}
                  {isClaimConfirmed("afterHoursUrgent") && (
                    <span className="mt-1 block text-sm text-muted-foreground">{tc("contact.afterHours")}</span>
                  )}
                </Detail>
              )}
              {!hours && isClaimConfirmed("afterHoursUrgent") && (
                <p className="text-sm text-muted-foreground">{tc("contact.afterHours")}</p>
              )}
              {contact.kvk && (
                <Detail icon={Building2} label={t("details.kvk")}>
                  {contact.kvk}
                </Detail>
              )}
            </dl>
          </div>

          <div>
            <h2 className="text-h2">
              {t("choice.title")} <span className="accent-text">{t("choice.accent")}</span>
            </h2>
            <div className="mt-8 grid gap-4">
              <article className="rounded-xl border border-border bg-background p-6">
                <h3 className="flex items-center gap-3 font-display text-h3 font-semibold">
                  <UserRound className="size-5 text-brand" aria-hidden="true" />
                  {t("choice.jobseeker.title")}
                </h3>
                <p className="mt-2 text-base text-muted-foreground">{t("choice.jobseeker.body")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <CtaButton href={ROUTES.vacatures} size="sm">
                    {t("choice.jobseeker.jobsLink")}
                  </CtaButton>
                  <CtaButton href={ROUTES.inschrijven} variant="secondary" size="sm">
                    {t("choice.jobseeker.registerLink")}
                  </CtaButton>
                </div>
              </article>
              <article className="rounded-xl border border-border bg-background p-6">
                <h3 className="flex items-center gap-3 font-display text-h3 font-semibold">
                  <Building2 className="size-5 text-brand" aria-hidden="true" />
                  {t("choice.employer.title")}
                </h3>
                <p className="mt-2 text-base text-muted-foreground">{t("choice.employer.body")}</p>
                <div className="mt-4">
                  <CtaButton href={ROUTES.personeelAanvragen} size="sm">
                    {t("choice.employer.requestLink")}
                  </CtaButton>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="contactformulier" aria-labelledby="contactformulier-titel" className="scroll-mt-24 bg-ice py-12 sm:py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h2 id="contactformulier-titel" className="text-h2">
              {t("form.title")} <span className="accent-text">{t("form.accent")}</span>
            </h2>
            <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">{t("form.intro")}</p>
          </div>
          <div className="mt-8 rounded-2xl border border-border bg-background p-5 sm:p-8 lg:max-w-[44rem]">
            <FormErrorBoundary form="contact">
              <ContactForm locale={locale} />
            </FormErrorBoundary>
          </div>
        </div>
      </section>
    </>
  );
}
