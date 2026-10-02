import type { LucideIcon } from "lucide-react";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { contact, socials, type Social } from "@/lib/site";
import { services } from "@/content/services";
import { cities } from "@/content/werkgebied";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";

/**
 * Footer (zelfde opbouw als J. Versseput): logo, omschrijving, reactiebelofte en
 * socials links; drie kolommen rechts (Diensten, Werkgebied, Contact met NAW,
 * KvK en btw) en een juridische balk onderaan. De NAW-gegevens op elke pagina
 * zijn bewust: ze ondersteunen lokale SEO (NAP-consistentie).
 */

const SOCIAL_ICONS: Record<Social["platform"], { icon: LucideIcon; label: string }> = {
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  instagram: { icon: Instagram, label: "Instagram" },
  facebook: { icon: Facebook, label: "Facebook" },
};

// Namen komen uit messages onder "footer"; hrefs houden de Nederlandse slugs aan.
const legalLinks = [
  { key: "privacy", href: "/privacybeleid" },
  { key: "terms", href: "/algemene-voorwaarden" },
] as const;

const LINK_CLASS =
  "inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-brand-strong lg:min-h-0 lg:py-1";
const HEADING_CLASS = "mb-3 font-sans text-sm font-semibold text-foreground";
const CONTACT_CLASS =
  "inline-flex min-h-11 items-center gap-2 transition-colors hover:text-brand-strong lg:min-h-0 lg:py-1";

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border bg-ice">
      <div className="container pt-14 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          {/* Logo, omschrijving en contactkanalen */}
          <div className="flex flex-col gap-5">
            <Link href="/#top" aria-label={contact.name} className="self-start rounded-sm">
              <Wordmark idSuffix="footer" showDescriptor className="h-11" />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
            <p className="text-sm font-medium text-brand-strong">
              {t("footer.responsePromise")}
            </p>
            {socials.length > 0 && (
              <ul className="flex items-center gap-3">
                {socials.map((social) => {
                  const { icon: Icon, label } = SOCIAL_ICONS[social.platform];
                  return (
                    <li key={social.href}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        data-slot="cta-button"
                        className={ctaButtonVariants({ variant: "ghost", size: "icon", className: "border border-border-strong" })}
                      >
                        <Icon aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Linkkolommen */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <nav aria-label={t("footer.columns.services")}>
              <h2 className={HEADING_CLASS}>{t("footer.columns.services")}</h2>
              <ul className="grid">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/diensten/${s.slug}`} className={LINK_CLASS}>
                      {t(`services.${s.slug}.title`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={t("footer.columns.workArea")}>
              <h2 className={HEADING_CLASS}>{t("footer.columns.workArea")}</h2>
              <ul className="grid">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/werkgebied/${c.slug}`} className={LINK_CLASS}>
                      {c.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/werkgebied"
                    className={cn(LINK_CLASS, "text-brand")}
                  >
                    {t("footer.allAreas")}
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <h2 className={HEADING_CLASS}>{t("footer.columns.contact")}</h2>
              <address className="grid gap-1 text-sm not-italic text-muted-foreground lg:gap-0">
                <a
                  href={contact.phoneHref}
                  className={CONTACT_CLASS}
                >
                  <Phone className="size-4 shrink-0 text-brand" aria-hidden />
                  {contact.phone}
                </a>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CONTACT_CLASS}
                >
                  <MessageCircle className="size-4 shrink-0 text-brand" aria-hidden />
                  WhatsApp
                </a>
                <a
                  href={contact.emailHref}
                  className={CONTACT_CLASS}
                >
                  <Mail className="size-4 shrink-0 text-brand" aria-hidden />
                  {contact.email}
                </a>
                {contact.street && <p>{contact.street}</p>}
                <p>
                  {contact.postalCode && `${contact.postalCode} `}
                  {contact.city}
                </p>
                <p>KvK {contact.kvk}</p>
                {contact.btw && <p>BTW {contact.btw}</p>}
              </address>
            </div>
          </div>
        </div>

        {/* Juridische balk; extra ruimte onderaan voor de mobiele actiebalk */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 pb-24 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between lg:pb-8">
          <p className="order-2 md:order-1">
            {t("footer.rights", {
              year: String(new Date().getFullYear()),
              name: contact.name,
            })}
          </p>
          <ul className="order-1 flex flex-wrap gap-x-6 md:order-2">
            {legalLinks.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-brand-strong lg:min-h-0"
                >
                  {t(`footer.${link.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
