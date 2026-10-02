import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { people } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { ContactPersonCard } from "@/components/contact/contact-person-card";

/** De mensen achter Groos (spec 04 §4.5.3): zelfde raster als HomePeople, zonder link. */
export async function AboutPeople({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "about.people" });

  return (
    <section id="contactpersonen" aria-labelledby="over-ons-mensen-titel" className="bg-ice">
      <div className="container section">
        <SectionHeading headingId="over-ons-mensen-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
        <Reveal>
          <ul role="list" className="mt-10 grid gap-4 sm:grid-cols-2 lg:max-w-4xl">
            {people.map((person) => (
              <li key={person.id}>
                <ContactPersonCard person={person} locale={locale} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
