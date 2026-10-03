import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { TeamContactCard } from "@/components/contact/team-contact-card";

/** Het team van Groos met één contactblok, zonder namen (spec 04 §4.3.6, B-60). */
export async function HomePeople({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.people" });

  return (
    <section id="contactpersonen" aria-labelledby="home-mensen-titel" className="bg-ice">
      <div className="container section">
        <SectionHeading headingId="home-mensen-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
        <Reveal>
          <div className="mt-10 lg:max-w-4xl">
            <TeamContactCard locale={locale} />
          </div>
        </Reveal>
        <Link
          href={ROUTES.overOns}
          className="link group/link mt-6 inline-flex min-h-11 items-center gap-2 font-medium"
        >
          {t("aboutLink")}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-150 ease-brand group-hover/link:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
