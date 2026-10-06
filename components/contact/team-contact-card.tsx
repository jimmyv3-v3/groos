import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TrackedContactLink } from "@/components/forms/tracked-contact-link";
import { CtaButton } from "@/components/ui/cta-button";
import type { Locale } from "@/i18n/routing";
import type { OccupationSlug } from "@/lib/data/options";
import { contact, whatsappLink } from "@/lib/site";
import type { FormId } from "@/lib/validation/shared";

type TeamContactCardProps = {
  locale: Locale;
  /** Toont de kop "Kom in contact met ons team" in de kaart, voor plekken zonder eigen sectiekop. */
  heading?: "h3";
  /** Tekst onder de kop of boven het nummer. */
  body?: string;
  /** Vooringevulde WhatsApp-tekst; standaard common.whatsapp.algemeen. */
  whatsappText?: string;
  form?: FormId;
  analytics?: { beroep?: OccupationSlug; vacature?: number };
};

const linkClasses = "underline-offset-4 hover:text-brand-strong hover:underline";

/**
 * Het ene contactblok van de publieke site (B-60): ons team, één
 * telefoonnummer, WhatsApp en e-mail. Geen persoonsnamen of eigen nummers.
 */
export async function TeamContactCard({
  locale,
  heading: Heading,
  body,
  whatsappText,
  form = "contact",
  analytics,
}: TeamContactCardProps) {
  const tc = await getTranslations({ locale, namespace: "common" });
  const [emailLocal, emailDomain] = contact.email.split("@");
  return (
    <article className="@container rounded-2xl border border-border bg-card">
      {/* Containerquery: het blok staat ook in smalle kolommen (vacature, contact). */}
      <div className="flex flex-col gap-6 p-6 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:gap-10 @3xl:p-8">
        <div className="grid min-w-0 gap-2">
          {Heading && <Heading className="font-display text-h3 font-semibold text-foreground">{tc("team.title")}</Heading>}
          {body && <p className="max-w-[52ch] text-base text-muted-foreground">{body}</p>}
          {/* Nummer en adres zijn zelf ook aan te tikken: elk minstens 44 px hoog. */}
          <div className="min-w-0">
            <p className="font-display text-h2 font-semibold tabular-nums text-foreground">
              <a href={contact.phoneHref} className={`inline-flex min-h-11 items-center ${linkClasses}`}>
                {contact.phone}
              </a>
            </p>
            <p className="text-base text-muted-foreground">
              {/* Past het adres niet op één regel, dan breekt het na het apenstaartje. */}
              <a href={contact.emailHref} className={`inline-block py-2 ${linkClasses}`}>
                {emailLocal}@<wbr />
                {emailDomain}
              </a>
            </p>
          </div>
        </div>
        <div className="grid gap-2 @md:grid-cols-3 @3xl:shrink-0">
          <TrackedContactLink
            kind="call"
            form={form}
            href={contact.phoneHref}
            label={tc("cta.call")}
            ariaLabel={tc("a11y.call", { phone: contact.phone })}
            beroep={analytics?.beroep}
            vacature={analytics?.vacature}
            className="w-full"
          />
          <TrackedContactLink
            kind="whatsapp"
            form={form}
            href={whatsappLink(whatsappText ?? tc("whatsapp.algemeen"))}
            label={tc("cta.whatsapp")}
            external
            newTabLabel={tc("opensInNewTab")}
            beroep={analytics?.beroep}
            vacature={analytics?.vacature}
            className="w-full"
          />
          <CtaButton variant="secondary" href={contact.emailHref} className="w-full">
            <Mail aria-hidden="true" />
            {tc("cta.email")}
          </CtaButton>
        </div>
      </div>
    </article>
  );
}
