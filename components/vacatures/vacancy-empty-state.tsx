import { ArrowRight, Phone, SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { beroepen } from "@/content/beroepen";
import type { OccupationSlug } from "@/lib/data/options";
import { paths, ROUTES } from "@/lib/routes";
import { contact } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";
import { IconTile } from "@/components/ui/icon-tile";
import { occupationPhrase } from "@/i18n/occupation-phrase";

type Props = { variant: "filtered" | "none"; locale: Locale; occupation?: OccupationSlug; clearHref: string };

/**
 * Lege staat (spec 06 §4.2, E-06-06): altijd drie uitwegen, namelijk filters
 * wissen of bellen, inschrijven en de beroepspagina's.
 */
export async function VacancyEmptyState({ variant, locale, occupation, clearHref }: Props) {
  const [t, tf, tc, tb] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.empty" }),
    getTranslations({ locale, namespace: "vacatures.filters" }),
    getTranslations({ locale, namespace: "common.cta" }),
    getTranslations({ locale, namespace: "beroepen" }),
  ]);
  const name = (id: OccupationSlug) => occupationPhrase(tb(`${id}.enkelvoud`), locale);

  return (
    <section aria-labelledby="vacatures-leeg-titel" className="rounded-2xl border border-border p-6 sm:p-8">
      <IconTile icon={SearchX} size="lg" />
      <h2 id="vacatures-leeg-titel" className="mt-5 text-h3">
        {t(`${variant}.title`)}
      </h2>
      <p className="mt-2 max-w-prose text-muted-foreground">{t(`${variant}.body`)}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {variant === "filtered" ? (
          <CtaButton href={clearHref} variant="secondary">
            {tf("clearAll")}
          </CtaButton>
        ) : (
          <CtaButton href={contact.phoneHref} variant="secondary">
            <Phone aria-hidden="true" />
            {tc("call")}
          </CtaButton>
        )}
        <CtaButton href={ROUTES.inschrijven}>{tc("register")}</CtaButton>
      </div>
      <div className="mt-6 border-t border-border pt-5">
        {occupation ? (
          <Link href={paths.werkenAls(occupation)} className="link inline-flex min-h-11 items-center gap-1.5 font-medium">
            {t("occupationLink", { occupation: name(occupation) })}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <nav aria-labelledby="vacatures-leeg-beroepen">
            <p id="vacatures-leeg-beroepen" className="text-sm font-semibold text-foreground">
              {t("occupationsLabel")}
            </p>
            <ul role="list" className="mt-2 flex flex-wrap gap-x-5">
              {[...beroepen]
                .sort((a, b) => a.order - b.order)
                .map((b) => (
                  <li key={b.id}>
                    <Link href={paths.werkenAls(b.id)} className="link inline-flex min-h-11 items-center">
                      {tb(`${b.id}.enkelvoud`)}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
