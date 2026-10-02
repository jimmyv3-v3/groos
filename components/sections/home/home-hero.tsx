import { Briefcase, ClipboardList, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { beroepen } from "@/content/beroepen";
import { ROUTES, paths } from "@/lib/routes";
import { contact } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * Hero met twee gelijkwaardige deuren (spec 04 §4.3.1): "Ik zoek werk" en
 * "Ik zoek personeel". Geen beeld, geen reveal en geen JavaScript; de h1 is
 * het LCP-element.
 */
export async function HomeHero() {
  const [t, tCommon, tBeroepen, tHeader] = await Promise.all([
    getTranslations("home.hero"),
    getTranslations("common"),
    getTranslations("beroepen"),
    getTranslations("header"),
  ]);

  return (
    <section aria-labelledby="home-titel" className="pt-4 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20">
      <div className="container">
        <h1 id="home-titel" className="max-w-[22ch] text-hero">
          {t.rich("title", { accent: (chunks) => <span className="accent-text">{chunks}</span> })}
        </h1>
        <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">{t("intro")}</p>

        <div className="mt-5 grid gap-3 md:mt-10 md:grid-cols-2 md:gap-6">
          <div role="group" aria-labelledby="deur-werk" className="pattern-oo flex min-w-0 flex-col rounded-2xl bg-brand-tint p-5 md:p-8">
            <h2 id="deur-werk" className="text-h3">
              {t("jobseeker.title")}
            </h2>
            <p className="mt-2">{t("jobseeker.body")}</p>
            <CtaButton href={ROUTES.vacatures} className="mt-3 w-full sm:mt-4 sm:w-auto sm:self-start">
              <Briefcase aria-hidden />
              {tCommon("cta.viewJobs")}
            </CtaButton>
            <ul
              role="list"
              aria-label={t("jobseeker.beroepenLabel")}
              className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] md:mx-0 md:mt-3 md:flex-wrap md:overflow-visible md:px-0"
            >
              {beroepen.map(({ id, icon: Icon }) => (
                <li key={id} className="shrink-0">
                  <CtaButton href={paths.werkenAls(id)} variant="secondary" size="sm">
                    <Icon aria-hidden className="size-4 text-brand" />
                    {tBeroepen(`${id}.enkelvoud`)}
                  </CtaButton>
                </li>
              ))}
            </ul>
          </div>

          <div role="group" aria-labelledby="deur-personeel" className="pattern-oo flex min-w-0 flex-col rounded-2xl bg-brand-tint p-5 md:p-8">
            <h2 id="deur-personeel" className="text-h3">
              {t("employer.title")}
            </h2>
            <p className="mt-2">{t("employer.body")}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:flex sm:flex-wrap md:grid lg:flex">
              <CtaButton href={ROUTES.personeelAanvragen} className="px-3 text-center max-sm:text-sm max-sm:leading-tight max-sm:whitespace-normal sm:px-5 md:max-lg:px-3 md:max-lg:text-sm md:max-lg:leading-tight md:max-lg:whitespace-normal">
                <ClipboardList aria-hidden className="max-[400px]:hidden md:max-lg:hidden" />
                {tCommon("cta.requestStaff")}
              </CtaButton>
              <CtaButton
                href={contact.phoneHref}
                variant="secondary"
                ariaLabel={tHeader("callAria", { phone: contact.phone })}
                className="px-3 text-center max-sm:text-sm max-sm:leading-tight max-sm:whitespace-normal sm:px-5 md:max-lg:px-3 md:max-lg:text-sm md:max-lg:leading-tight md:max-lg:whitespace-normal"
              >
                <Phone aria-hidden />
                {tCommon("cta.call")}
              </CtaButton>
            </div>
            <p className="mt-3 text-sm text-muted-foreground md:mt-auto md:pt-3">
              {tCommon("notes.noObligationEmployer")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
