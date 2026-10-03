import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactAside } from "@/components/forms/contact-aside";
import { FormErrorBoundary } from "@/components/forms/form-error-boundary";
import { StaffRequestForm } from "@/components/forms/staff-request-form";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { ServiceSteps } from "@/components/service/service-steps";
import { CtaButton } from "@/components/ui/cta-button";
import { resolveLocale } from "@/i18n/locale";
import { isClaimConfirmed } from "@/lib/claims";
import { OCCUPATION_SLUGS } from "@/lib/data/options";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { contact, people } from "@/lib/site";

// Personeel aanvragen (spec 07 §4.7). Statisch; het formulier leest ?beroep=
// in de browser.

export async function generateMetadata({ params }: PageProps<"/[locale]/werkgevers/personeel-aanvragen">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "forms" });
  return pageMetadata({
    locale,
    path: ROUTES.personeelAanvragen,
    title: t("staffRequest.meta.title"),
    description: t("staffRequest.meta.description"),
  });
}

export default async function Page({ params }: PageProps<"/[locale]/werkgevers/personeel-aanvragen">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const [t, tc, tb, th] = await Promise.all([
    getTranslations({ locale, namespace: "forms" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "beroepen" }),
    getTranslations({ locale, namespace: "header" }),
  ]);
  const occupationOptions = OCCUPATION_SLUGS.map((id) => ({ value: id, label: tb(`${id}.meervoud`) }));
  const either = new Intl.ListFormat(locale, { type: "disjunction" }).format(people.map((p) => p.firstName));
  const first = people[0];
  const aside = {
    form: "staffRequest" as const,
    locale,
    title: t("staffRequest.alternatives.title"),
    body: t("staffRequest.alternatives.body", { name: either }),
    whatsappText: tc("whatsapp.werkgever"),
    persons: people.map((p) => ({ name: p.firstName, phone: p.phone, whatsapp: p.whatsapp })),
  };
  const steps = t.raw("staffRequest.steps.items") as { title: string; body: string }[];

  return (
    <>
      <section className="pt-8 pb-4 sm:pt-12">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: th("nav.werkgevers"), href: ROUTES.werkgevers },
              { label: th("nav.personeelAanvragen"), href: ROUTES.personeelAanvragen },
            ]}
            className="mb-8"
          />
          <div className="max-w-3xl">
            <h1 className="text-h1">{t("staffRequest.title")}</h1>
            <p className="mt-5 max-w-[60ch] text-lead text-muted-foreground">{t("staffRequest.intro")}</p>
            <p className="mt-3 text-base text-muted-foreground">{tc("notes.noObligationEmployer")}</p>
          </div>
          <div className="mt-6 flex max-w-3xl flex-col gap-3 rounded-xl border border-border bg-ice p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="grid gap-1">
              <p className="text-base font-medium text-foreground">{tc("notes.urgentEmployer")}</p>
              {isClaimConfirmed("afterHoursUrgent") && (
                <p className="text-sm text-muted-foreground">{tc("contact.afterHours")}</p>
              )}
            </div>
            <CtaButton
              variant="secondary"
              href={contact.phoneHref}
              ariaLabel={tc("a11y.callPerson", { name: first.firstName, phone: contact.phone })}
              className="shrink-0"
            >
              <Phone aria-hidden="true" />
              {tc("cta.callPerson", { name: first.firstName })}
            </CtaButton>
          </div>
        </div>
      </section>

      <section aria-labelledby="aanvragen-titel" className="py-10 sm:py-14">
        <div className="container">
          <div className="mb-8 lg:hidden">
            <ContactAside {...aside} variant="strip" />
          </div>
          <h2 id="aanvragen-titel" className="text-h2">
            {t("staffRequest.formTitle")} <span className="accent-text">{t("staffRequest.formAccent")}</span>
          </h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <FormErrorBoundary form="staffRequest">
                <StaffRequestForm locale={locale} occupationOptions={occupationOptions} />
              </FormErrorBoundary>
            </div>
            <div className="hidden lg:col-span-5 lg:block">
              <div className="sticky top-24">
                <ContactAside {...aside} variant="panel" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceSteps id="zo-gaat-het" heading={t("staffRequest.steps.title")} accent={t("staffRequest.steps.accent")} steps={steps} />
    </>
  );
}
