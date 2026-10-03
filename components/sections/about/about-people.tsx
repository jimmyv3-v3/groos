import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { TeamContactCard } from "@/components/contact/team-contact-card";

/** Contact met het team (spec 04 §4.5.3, B-60): zelfde blok als HomePeople, zonder link. */
export async function AboutPeople({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "about.people" });

  return (
    <section id="contactpersonen" aria-labelledby="over-ons-mensen-titel" className="bg-ice">
      <div className="container section">
        <SectionHeading headingId="over-ons-mensen-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
        <Reveal>
          <div className="mt-10 lg:max-w-4xl">
            <TeamContactCard locale={locale} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
