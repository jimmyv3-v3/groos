import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactAside } from "@/components/forms/contact-aside";
import { FormErrorBoundary } from "@/components/forms/form-error-boundary";
import { RegisterForm } from "@/components/forms/register-form";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { ServiceSteps } from "@/components/service/service-steps";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/locale";
import { OCCUPATION_SLUGS } from "@/lib/data/options";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// Inschrijven zonder vacature (spec 07 §4.6). Statisch; het formulier leest
// ?beroep= in de browser.

export async function generateMetadata({ params }: PageProps<"/[locale]/inschrijven">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "forms" });
  return pageMetadata({
    locale,
    path: ROUTES.inschrijven,
    title: t("register.meta.title"),
    description: t("register.meta.description"),
  });
}

export default async function Page({ params }: PageProps<"/[locale]/inschrijven">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const [t, tc, tb, th] = await Promise.all([
    getTranslations({ locale, namespace: "forms" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "beroepen" }),
    getTranslations({ locale, namespace: "header" }),
  ]);
  const occupationOptions = OCCUPATION_SLUGS.map((id) => ({ value: id, label: tb(`${id}.enkelvoud`) }));
  const aside = {
    form: "register" as const,
    locale,
    title: t("register.alternatives.title"),
    body: t("register.alternatives.body"),
    whatsappText: tc("whatsapp.werkzoekende"),
  };
  const benefits = t.raw("register.benefits") as string[];
  const steps = t.raw("register.steps.items") as { title: string; body: string }[];

  return (
    <>
      <section className="pt-8 pb-4 sm:pt-12">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: th("nav.werkzoekenden"), href: ROUTES.werkzoekenden },
              { label: th("nav.inschrijven"), href: ROUTES.inschrijven },
            ]}
            className="mb-8"
          />
          <div className="max-w-3xl">
            <h1 className="text-h1">{t("register.title")}</h1>
            <p className="mt-5 max-w-[60ch] text-lead text-muted-foreground">{t("register.intro")}</p>
            <ul className="mt-6 grid gap-2.5">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-base text-foreground">
                  <Check className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="inschrijven-titel" className="py-10 sm:py-14">
        <div className="container">
          <div className="mb-8 lg:hidden">
            <ContactAside {...aside} variant="strip" />
          </div>
          <h2 id="inschrijven-titel" className="text-h2">
            {t("register.formTitle")} <span className="accent-text">{t("register.formAccent")}</span>
          </h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <FormErrorBoundary form="register">
                <RegisterForm locale={locale} occupationOptions={occupationOptions} />
              </FormErrorBoundary>
            </div>
            <div className="lg:col-span-5">
              <div className="grid gap-4 lg:sticky lg:top-24">
                <div className="hidden lg:block">
                  <ContactAside {...aside} variant="panel" />
                </div>
                <Link
                  href={ROUTES.vacatures}
                  className="inline-flex min-h-11 items-center gap-2 font-medium text-brand underline-offset-4 hover:underline"
                >
                  {t("register.jobsLink")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceSteps id="zo-gaat-het" heading={t("register.steps.title")} accent={t("register.steps.accent")} steps={steps} />
    </>
  );
}
