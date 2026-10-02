import { getTranslations } from "next-intl/server";
import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { contact } from "@/lib/site";
import { getNavModel } from "@/lib/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { HeaderFrame } from "@/components/sections/header/header-frame";
import { DesktopNav } from "@/components/sections/header/desktop-nav";
import { HeaderCta } from "@/components/sections/header/header-cta";
import { MobileMenu } from "@/components/sections/header/mobile-menu";

/**
 * Header (structuur spec 01 §4.4, uiterlijk spec 02 §4.13). Server shell die
 * het navigatiemodel oplost en aan vier kleine clienteilanden doorgeeft. De
 * layout rendert hem één keer.
 */
export async function SiteHeader() {
  const [model, t] = await Promise.all([getNavModel(), getTranslations("header")]);

  return (
    <HeaderFrame>
      <div className="container flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label={t("homeAria")} className="shrink-0 rounded-sm">
          <Wordmark idSuffix="header" className="h-6.5 lg:h-7" />
        </Link>

        <DesktopNav items={model.items} ariaLabel={t("mainMenu")} />

        <div className="ml-auto flex items-center gap-1">
          <a
            href={contact.phoneHref}
            aria-label={t("callAria", { phone: contact.phone })}
            data-slot="cta-button"
            className={cn(ctaButtonVariants({ variant: "ghost", size: "sm" }), "hidden px-3 tabular-nums lg:inline-flex")}
          >
            <Phone className="text-brand" aria-hidden />
            <span className="hidden xl:inline">{contact.phone}</span>
          </a>
          <LanguageToggle className="hidden lg:inline-flex" />
          <div className="ml-2 hidden lg:block">
            <HeaderCta ctas={model.headerCtas} />
          </div>
          <MobileMenu
            items={model.items}
            ctas={[model.headerCtas.inschrijven, model.headerCtas.personeelAanvragen]}
            phone={{ ...model.actions.call, label: contact.phone }}
            whatsapp={model.actions.whatsappAlgemeen}
            logo={<Wordmark idSuffix="mobile-menu" className="h-6.5" />}
            labels={{ open: t("openMenu"), close: t("closeMenu"), title: t("mobileMenu"), home: t("homeAria") }}
          />
        </div>
      </div>
    </HeaderFrame>
  );
}
