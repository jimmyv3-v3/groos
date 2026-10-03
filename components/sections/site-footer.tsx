import type { LucideIcon } from "lucide-react";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { contact, socials, whatsappLink, type Social } from "@/lib/site";
import { getNavModel } from "@/lib/navigation";
import { formatTime } from "@/lib/format";
import { Wordmark } from "@/components/brand/wordmark";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { FooterLegal } from "@/components/legal/footer-legal";

/**
 * Footer (structuur spec 01 §4.8, uiterlijk spec 02 §4.13). Merkblok, drie
 * linkkolommen, contactblok met <address> en een onderbalk met de wettelijke
 * vermeldingen van spec 09 (FooterLegal), de rechtenregel en de taalknop. Dezelfde NAW op elke pagina (NAP-consistentie, spec 12).
 */

const SOCIAL_ICONS: Record<Social["platform"], { icon: LucideIcon; label: string }> = {
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  instagram: { icon: Instagram, label: "Instagram" },
  facebook: { icon: Facebook, label: "Facebook" },
};

const HEADING = "mb-3 font-sans text-sm font-semibold text-foreground";
const LINK =
  "inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors duration-150 hover:text-brand-strong lg:min-h-0 lg:py-1";
const CONTACT_LINK =
  "inline-flex min-h-11 items-center gap-2 transition-colors duration-150 hover:text-brand-strong lg:min-h-0 lg:py-1 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-brand";

export async function SiteFooter() {
  const [model, locale, t, th, tc] = await Promise.all([
    getNavModel(),
    getLocale(),
    getTranslations("footer"),
    getTranslations("header"),
    getTranslations("common"),
  ]);
  const hours = contact.openingHours;

  return (
    <footer className="border-t border-border bg-ice">
      <div className="container pt-14 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Merkblok */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Link href="/" aria-label={th("homeAria")} className="self-start rounded-sm">
              <Wordmark idSuffix="footer" showDescriptor className="h-11" />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">{t("description")}</p>
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
                        aria-label={`${label} ${tc("opensInNewTab")}`}
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
          <nav aria-label={t("navLabel")} className="grid gap-10 sm:grid-cols-3 lg:col-span-5 lg:gap-8">
            {model.footerColumns.map((column) => (
              <div key={column.key}>
                <h2 className={HEADING}>{column.title}</h2>
                <ul className="grid">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={LINK}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className={HEADING}>{t("columns.contact")}</h2>
            <address className="grid gap-1 text-sm not-italic text-muted-foreground lg:gap-0">
              <p>{contact.name}</p>
              <p>{contact.street}</p>
              <p>
                {contact.postalCode} {contact.city}
              </p>
              {contact.visitByAppointment && <p className="mb-2">{tc("address.byAppointment")}</p>}
              <a href={contact.phoneHref} aria-label={th("callAria", { phone: contact.phone })} className={`${CONTACT_LINK} tabular-nums`}>
                <Phone aria-hidden />
                {contact.phone}
              </a>
              <a
                href={whatsappLink(tc("whatsapp.algemeen"))}
                target="_blank"
                rel="noopener noreferrer"
                className={CONTACT_LINK}
              >
                <MessageCircle aria-hidden />
                {tc("contact.whatsapp")}
                <span className="sr-only"> {tc("opensInNewTab")}</span>
              </a>
              <a href={contact.emailHref} className={CONTACT_LINK}>
                <Mail aria-hidden />
                {contact.email}
              </a>
              {hours && (
                <p className="mt-2">
                  {t("openingHours", {
                    opens: formatTime(hours.opens, locale as Locale),
                    closes: formatTime(hours.closes, locale as Locale),
                  })}
                </p>
              )}
            </address>
          </div>
        </div>

        {/* Onderbalk: wettelijke vermeldingen (spec 09 §4.5), rechtenregel en taalknop */}
        <div className="mt-12 border-t border-border pt-6 pb-8">
          <FooterLegal />
          <div className="mt-4 flex flex-col gap-1 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>{t("rights", { year: String(new Date().getFullYear()), name: contact.name })}</p>
            <LanguageToggle className="self-start" />
          </div>
        </div>
      </div>
    </footer>
  );
}
