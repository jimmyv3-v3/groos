// STUB: wordt vervangen door spec 07
import { MessageCircle, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { whatsappLink, type Person } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * Tijdelijke personenkaart met de props van spec 07 (`{ person, locale, headingLevel }`):
 * initiaal in een cirkel, voornaam als kop, nummer als tel:-link, belknop en
 * alleen bij person.whatsapp een WhatsApp-knop. Spec 07 voegt TrackedContactLink toe.
 */
export async function ContactPersonCard({
  person,
  locale,
  headingLevel = "h3",
}: {
  person: Person;
  locale: Locale;
  headingLevel?: "h3";
}) {
  const t = await getTranslations({ locale, namespace: "common" });
  const Heading = headingLevel;
  const tel = `tel:${person.phone.e164}`;

  return (
    <div
      data-slot="contact-person-card"
      className="flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-6 md:p-7"
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-tint font-display text-h3 font-semibold text-brand"
        >
          {person.firstName.charAt(0)}
        </span>
        <div className="min-w-0">
          <Heading className="font-display text-h3 font-semibold">{person.firstName}</Heading>
          <a href={tel} className="link tabular-nums">
            {person.phone.display}
          </a>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <CtaButton
          href={tel}
          variant="secondary"
          size="sm"
          ariaLabel={t("a11y.callPerson", { name: person.firstName, phone: person.phone.display })}
        >
          <Phone aria-hidden />
          {t("cta.callPerson", { name: person.firstName })}
        </CtaButton>
        {person.whatsapp && (
          <CtaButton
            href={whatsappLink(t("whatsapp.algemeen"), person.phone)}
            variant="secondary"
            size="sm"
            external
            ariaLabel={`${t("a11y.whatsappPerson", { name: person.firstName })} ${t("opensInNewTab")}`}
          >
            <MessageCircle aria-hidden />
            {t("cta.whatsappPerson", { name: person.firstName })}
          </CtaButton>
        )}
      </div>
    </div>
  );
}
