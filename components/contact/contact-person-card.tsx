import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { TrackedContactLink } from "@/components/forms/tracked-contact-link";
import type { Locale } from "@/i18n/routing";
import { whatsappLink, type Person } from "@/lib/site";

/**
 * Kaart van een vaste contactpersoon (spec 07 §4.9). Zonder foto een cirkel
 * met de eerste letter (B-25); geen rol of achternaam zolang die niet
 * bevestigd zijn. Opbouw naar 21st.dev 5689 en 28619, zonder sociale knoppen.
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
  const [t, tc] = await Promise.all([
    getTranslations({ locale, namespace: "contact.people" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const Heading = headingLevel;
  return (
    <article className="flex h-full flex-col gap-5 rounded-xl border border-border bg-background p-6">
      <div className="flex items-center gap-4">
        {person.photo ? (
          <Image
            src={person.photo}
            alt={t("photoAlt", { name: person.firstName })}
            width={64}
            height={64}
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-tint font-display text-2xl font-semibold text-brand-strong"
          >
            {person.firstName.charAt(0)}
          </span>
        )}
        <div className="grid gap-0.5">
          <Heading className="font-display text-h3 font-semibold text-foreground">{person.firstName}</Heading>
          <a
            href={`tel:${person.phone.e164}`}
            className="text-base tabular-nums text-muted-foreground underline-offset-4 hover:text-brand-strong hover:underline"
          >
            {person.phone.display}
          </a>
        </div>
      </div>
      <div className="mt-auto grid gap-2 sm:grid-cols-2">
        <TrackedContactLink
          kind="call"
          form="contact"
          href={`tel:${person.phone.e164}`}
          label={tc("cta.callPerson", { name: person.firstName })}
          ariaLabel={tc("a11y.callPerson", { name: person.firstName, phone: person.phone.display })}
          className="w-full"
        />
        {person.whatsapp && (
          <TrackedContactLink
            kind="whatsapp"
            form="contact"
            href={whatsappLink(tc("whatsapp.algemeen"), person.phone)}
            label={tc("cta.whatsappPerson", { name: person.firstName })}
            external
            newTabLabel={tc("opensInNewTab")}
            className="w-full"
          />
        )}
      </div>
    </article>
  );
}
