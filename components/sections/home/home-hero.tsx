import { Briefcase, Building2, ClipboardList, Phone, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { beroepen } from "@/content/beroepen";
import { ROUTES, paths } from "@/lib/routes";
import { contact } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { IconTile } from "@/components/ui/icon-tile";

const DOOR_CLASS = "flex min-w-0 flex-col rounded-2xl border border-border bg-card p-4 shadow-xs sm:p-5 md:p-8";

/**
 * Achtergrond van de hero, ter keuze (zie .playwright-mcp/hero-achtergrond-*):
 * "none": het witte paginavlak, zonder decoratie;
 * "grid": een fijn ruitjesraster dat rechtsboven het sterkst is en naar de
 *         tekst toe volledig uitloopt;
 * "glow": een zachte gloed in de blauwtint rechts, die naar alle kanten uitloopt.
 * Alle drie zijn CSS zonder JavaScript en zonder vlak of rand.
 */
export type HeroBackground = "none" | "grid" | "glow";

/**
 * Hero met twee gelijkwaardige deuren (spec 04 §4.3.1): "Ik zoek werk" en
 * "Ik zoek personeel", als twee losse kaarten onder de kop en de intro, die
 * links staan. Geen beeld, geen reveal en geen JavaScript; de h1 is het
 * LCP-element en beweegt niet.
 */
export async function HomeHero({ background = "none" }: { background?: HeroBackground }) {
  const [t, tCommon, tBeroepen, tHeader] = await Promise.all([
    getTranslations("home.hero"),
    getTranslations("common"),
    getTranslations("beroepen"),
    getTranslations("header"),
  ]);

  return (
    <section
      aria-labelledby="home-titel"
      data-background={background}
      className="relative isolate pt-2 pb-10 sm:pt-4 md:pt-12 md:pb-12 lg:pt-16 lg:pb-14"
    >
      {background === "grid" && (
        <GridPattern variant="grid" fade="top-right" size={44} className="max-md:[--deco-shape:60%_40%]" />
      )}
      {background === "glow" && <div aria-hidden="true" className="deco-glow" />}
      <div className="container">
        <h1 id="home-titel" className="max-w-[22ch] text-hero">
          {t.rich("title", { accent: (chunks) => <span className="accent-text">{chunks}</span> })}
        </h1>
        <p className="mt-3 max-w-[60ch] text-lead text-muted-foreground sm:mt-4">{t("intro")}</p>

        {/* Op 390 bij 844 moeten beide hoofdknoppen boven de vaste actiebalk
            zichtbaar zijn (AC-04-02); daarom op telefoons krappe marges,
            kleinere deurtekst en knoppen van 44 px. */}
        <div className="mt-4 grid gap-3 sm:mt-6 md:mt-10 md:grid-cols-2 md:gap-6">
          <div role="group" aria-labelledby="deur-werk" className={DOOR_CLASS}>
            <div className="flex items-center gap-3">
              <IconTile icon={UserRound} className="max-md:hidden" />
              <h2 id="deur-werk" className="text-h3">
                {t("jobseeker.title")}
              </h2>
            </div>
            <p className="mt-1 text-sm sm:text-base md:mt-4">{t("jobseeker.body")}</p>
            <CtaButton href={ROUTES.vacatures} className="mt-3 w-full max-sm:h-11 sm:mt-4 sm:w-auto sm:self-start">
              <Briefcase aria-hidden />
              {tCommon("cta.viewJobs")}
            </CtaButton>
            <ul
              role="list"
              aria-label={t("jobseeker.beroepenLabel")}
              className="-mx-4 mt-2 flex gap-2 overflow-x-auto py-1 pr-10 pl-4 [scrollbar-width:none] max-md:mask-r-from-[calc(100%-2.5rem)] sm:-mx-5 sm:pl-5 md:mx-0 md:mt-auto md:flex-wrap md:overflow-visible md:px-0 md:pt-6 md:pb-0"
            >
              {/* Telefoon: de rij schuift opzij. De rechterrand loopt uit, zodat
                  zichtbaar is dat er meer beroepen volgen; de ruimte rechts laat
                  het laatste beroep vrij van die uitloop. */}
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

          <div role="group" aria-labelledby="deur-personeel" className={DOOR_CLASS}>
            <div className="flex items-center gap-3">
              <IconTile icon={Building2} className="max-md:hidden" />
              <h2 id="deur-personeel" className="text-h3">
                {t("employer.title")}
              </h2>
            </div>
            <p className="mt-1 text-sm sm:text-base md:mt-4">{t("employer.body")}</p>
            {/* 390: onder elkaar op volle breedte, "Personeel aanvragen" bovenaan;
                768 tot 1023: smalle deur, dus onder elkaar; daarna naast elkaar. */}
            <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:flex-wrap md:max-lg:flex-col">
              <CtaButton href={ROUTES.personeelAanvragen} className="w-full max-sm:h-11 sm:w-auto md:max-lg:w-full">
                <ClipboardList aria-hidden />
                {tCommon("cta.requestStaff")}
              </CtaButton>
              <CtaButton
                href={contact.phoneHref}
                variant="secondary"
                ariaLabel={tHeader("callAria", { phone: contact.phone })}
                className="w-full max-sm:h-11 sm:w-auto md:max-lg:w-full"
              >
                <Phone aria-hidden />
                {tCommon("cta.call")}
              </CtaButton>
            </div>
            <p className="mt-3 text-sm text-muted-foreground md:mt-auto md:pt-6">
              {tCommon("notes.noObligationEmployer")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
