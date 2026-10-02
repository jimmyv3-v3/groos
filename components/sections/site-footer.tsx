import type { LucideIcon } from "lucide-react";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { contact, socials, type Social } from "@/lib/site";
import { services } from "@/content/services";
import { cities } from "@/content/werkgebied";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "@/components/brand/wordmark";

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

const LINK_CLASS = "text-muted-foreground transition-colors hover:text-brand-strong";
const HEADING_CLASS =
  "mb-4 font-display text-xs font-medium uppercase tracking-wider text-foreground";

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="container py-20">
        <div className="flex w-full flex-col justify-between gap-12 lg:flex-row lg:items-start">
          {/* Logo, omschrijving en contactkanalen */}
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Link href="/#top" aria-label={contact.name}>
              <Wordmark idSuffix="footer" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
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
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/40 text-muted-foreground transition-colors hover:text-brand-strong"
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Linkkolommen */}
          <div className="grid w-full gap-10 sm:grid-cols-3 lg:max-w-2xl lg:gap-16">
            <nav aria-label={t("footer.columns.services")}>
              <h2 className={HEADING_CLASS}>{t("footer.columns.services")}</h2>
              <ul className="space-y-3 text-sm">
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
              <ul className="space-y-3 text-sm">
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
                    className="text-brand transition-colors hover:text-brand-strong"
                  >
                    {t("footer.allAreas")}
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <h2 className={HEADING_CLASS}>{t("footer.columns.contact")}</h2>
              <address className="space-y-3 text-sm not-italic text-muted-foreground">
                <a
                  href={contact.phoneHref}
                  className="flex items-center gap-2 transition-colors hover:text-brand-strong"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  {contact.phone}
                </a>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-brand-strong"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                  WhatsApp
                </a>
                <a
                  href={contact.emailHref}
                  className="flex items-center gap-2 transition-colors hover:text-brand-strong"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
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
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-border/40 pt-8 pb-24 text-xs font-medium text-muted-foreground md:flex-row md:items-center lg:pb-0">
          <p className="order-2 md:order-1">
            {t("footer.rights", {
              year: String(new Date().getFullYear()),
              name: contact.name,
            })}
          </p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-6">
            {legalLinks.map((link) => (
              <li key={link.key}>
                <Link href={link.href} className="transition-colors hover:text-brand-strong">
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
