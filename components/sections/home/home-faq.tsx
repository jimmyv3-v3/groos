import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { SectionHeading } from "@/components/sections/section-heading";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { getHomeFaqSets } from "@/components/sections/home/faq-items";

const LABEL_CLASS =
  "relative inline-flex h-11 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-brand hover:text-foreground has-[:checked]:bg-background has-[:checked]:text-foreground has-[:checked]:shadow-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring";

const LINK_CLASS = "link group/link mt-6 inline-flex min-h-11 items-center gap-2 font-medium";

/**
 * Veelgestelde vragen voor twee doelgroepen (spec 04 §4.3.7). De wissel is een
 * paar native keuzerondjes; CSS met :has() toont de gekozen set. Geen
 * JavaScript: alle tien antwoorden staan in de HTML, in native <details>.
 */
export async function HomeFaq() {
  const locale = resolveLocale(await getLocale());
  const [t, sets] = await Promise.all([getTranslations("home.faq"), getHomeFaqSets(locale)]);

  return (
    <section id="veelgestelde-vragen" aria-labelledby="home-faq-titel" className="group/faq">
      <div className="container section lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading headingId="home-faq-titel" title={t("title")} accent={t("accent")} />
          <fieldset className="mt-8 min-w-0">
            <legend className="sr-only">{t("switchLabel")}</legend>
            <div className="grid w-full grid-cols-2 gap-1 rounded-lg bg-muted p-1 md:inline-grid md:w-auto">
              <label className={LABEL_CLASS}>
                <input
                  type="radio"
                  name="faq-doelgroep"
                  id="faq-tab-werkzoekende"
                  value="werkzoekende"
                  defaultChecked
                  className="sr-only"
                />
                {t("jobseeker.tab")}
              </label>
              <label className={LABEL_CLASS}>
                <input type="radio" name="faq-doelgroep" id="faq-tab-werkgever" value="werkgever" className="sr-only" />
                {t("employer.tab")}
              </label>
            </div>
          </fieldset>
        </div>

        <div className="mt-6 max-w-3xl lg:mt-0">
          <div data-faq="werkzoekende" className="group-has-[#faq-tab-werkgever:checked]/faq:hidden">
            <h3 className="sr-only">{t("jobseeker.tab")}</h3>
            <Accordion>
              {sets.jobseeker.map((item) => (
                <AccordionItem key={item.q} name="faq-werkzoekende" title={item.q}>
                  {item.a}
                </AccordionItem>
              ))}
            </Accordion>
            <Link href={ROUTES.werkzoekenden} className={LINK_CLASS}>
              {t("jobseeker.moreLink")}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-150 ease-brand group-hover/link:translate-x-0.5"
              />
            </Link>
          </div>
          <div data-faq="werkgever" className="hidden group-has-[#faq-tab-werkgever:checked]/faq:block">
            <h3 className="sr-only">{t("employer.tab")}</h3>
            <Accordion>
              {sets.employer.map((item) => (
                <AccordionItem key={item.q} name="faq-werkgever" title={item.q}>
                  {item.a}
                </AccordionItem>
              ))}
            </Accordion>
            <Link href={ROUTES.werkgevers} className={LINK_CLASS}>
              {t("employer.moreLink")}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-150 ease-brand group-hover/link:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
