import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";
import { people, type Phone } from "@/lib/site";
import { formatPhoneDisplay } from "@/lib/validation/phone";
import { ApplyForm, type ApplyFormVacancy } from "./apply-form";
import { ContactAside } from "./contact-aside";
import { FormErrorBoundary } from "./form-error-boundary";

type ApplySectionProps = { vacancy: VacancyDetail; locale: Locale };

/**
 * Het sollicitatieblok op de vacaturepagina (spec 07 §4.4). Spec 06 plaatst
 * het alleen bij vacancy.state === "open"; dit is het enige blok met
 * section#solliciteren. Er gaan geen gegevens van de contactpersoon naar de client.
 */
export async function ApplySection({ vacancy, locale }: ApplySectionProps) {
  const [t, tc] = await Promise.all([
    getTranslations({ locale, namespace: "forms.apply" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const either = new Intl.ListFormat(locale, { type: "disjunction" }).format(people.map((p) => p.firstName));
  const contactPerson = vacancy.contact;
  const persons: { name: string; phone: Phone; whatsapp: boolean }[] =
    contactPerson && contactPerson.phoneE164
      ? [
          {
            name: contactPerson.name,
            phone: { display: formatPhoneDisplay(contactPerson.phoneE164), e164: contactPerson.phoneE164 as Phone["e164"] },
            whatsapp: vacancy.allowWhatsappApply && contactPerson.whatsappE164 !== null,
          },
        ]
      : people.map((p) => ({ name: p.firstName, phone: p.phone, whatsapp: vacancy.allowWhatsappApply && p.whatsapp }));

  const applyVacancy: ApplyFormVacancy = {
    number: vacancy.number,
    title: vacancy.title,
    occupationSlug: vacancy.occupation.slug,
    asksDrivingLicenseB: vacancy.asksDrivingLicenseB,
  };
  const aside = {
    form: "apply" as const,
    locale,
    title: t("alternatives.title"),
    body: t("alternatives.body", { number: vacancy.number }),
    whatsappText: tc("whatsapp.vacatureSolliciteren", { title: vacancy.title, number: vacancy.number }),
    persons,
    analytics: { beroep: vacancy.occupation.slug, vacature: vacancy.number },
  };

  return (
    <section id="solliciteren" aria-labelledby="solliciteren-titel" className="scroll-mt-24 py-12 sm:py-16">
      <div className="container">
        <div className="max-w-3xl">
          <h2 id="solliciteren-titel" className="text-h2">
            {t("title")} <span className="accent-text">{t("accent")}</span>
          </h2>
          <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">
            {t("intro", { name: contactPerson?.name ?? either })}
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            {t("vacancyLine", { title: vacancy.title, number: vacancy.number })}
          </p>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:hidden">
            <ContactAside {...aside} variant="strip" />
          </div>
          <div className="lg:col-span-7">
            <FormErrorBoundary form="apply">
              <ApplyForm vacancy={applyVacancy} locale={locale} />
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
  );
}
