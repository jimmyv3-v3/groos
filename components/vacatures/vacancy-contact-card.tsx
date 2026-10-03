import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";
import { TeamContactCard } from "@/components/contact/team-contact-card";

type Props = { vacancy: VacancyDetail; locale: Locale };

/** Vragen over de vacature gaan naar ons team op het hoofdnummer, zonder persoonsnaam (spec 06 §4.10, B-60). */
export async function VacancyContactCard({ vacancy, locale }: Props) {
  const [t, tw] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.detail" }),
    getTranslations({ locale, namespace: "common.whatsapp" }),
  ]);

  return (
    <section aria-labelledby="vacature-vragen">
      <h2 id="vacature-vragen" className="text-h3 sm:text-[1.5rem]">
        {t("sections.contact")}
      </h2>
      <div className="mt-4">
        <TeamContactCard
          locale={locale}
          heading="h3"
          body={t("contact.body")}
          whatsappText={tw("vacatureVraag", { title: vacancy.title, number: vacancy.number })}
          form="apply"
          analytics={{ beroep: vacancy.occupation.slug, vacature: vacancy.number }}
        />
      </div>
    </section>
  );
}
