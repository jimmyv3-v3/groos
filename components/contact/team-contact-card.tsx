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
  return (
    <article className="flex flex-col gap-6 rounded-xl border border-border bg-background p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid gap-2">
        {Heading && <Heading className="font-display text-h3 font-semibold text-foreground">{tc("team.title")}</Heading>}
        {body && <p className="max-w-[52ch] text-base text-muted-foreground">{body}</p>}
        <p className="font-display text-2xl font-semibold tabular-nums text-foreground">
          <a href={contact.phoneHref} className={linkClasses}>
            {contact.phone}
          </a>
        </p>
        <p className="text-base text-muted-foreground">
          <a href={contact.emailHref} className={`break-all ${linkClasses}`}>
            {contact.email}
          </a>
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3 lg:shrink-0 lg:grid-cols-1 xl:grid-cols-3">
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
    </article>
  );
}
