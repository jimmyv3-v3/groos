import { getTranslations } from "next-intl/server";
import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
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
      <div className="container flex h-full items-center justify-between gap-4">
        {/* Blok met flex-centrering: het logo van 143 bij 43 px staat op hele pixels. */}
        <Link href="/" aria-label={t("homeAria")} className="flex min-h-11 shrink-0 items-center rounded-sm">
          <Wordmark idSuffix="header" />
        </Link>

        <DesktopNav items={model.items} ariaLabel={t("mainMenu")} />

        <div className="ml-auto flex items-center gap-1">
          <a
            href={contact.phoneHref}
            aria-label={t("callAria", { phone: contact.phone })}
            data-slot="cta-button"
            className={ctaButtonVariants({
              variant: "ghost",
              size: "icon",
              className: "hidden tabular-nums lg:inline-flex xl:h-10 xl:w-auto xl:px-4",
            })}
          >
            <Phone className="text-brand" aria-hidden />
            <span className="hidden xl:inline">{contact.phone}</span>
          </a>
          <LanguageToggle className="hidden lg:inline-flex" />
          {/* Tussen 1024 en 1184 px passen logo, menu, belknop, taalknop en deze knop
              niet naast elkaar ("Personeel aanvragen" liep tot 95 px buiten beeld, met
              horizontaal scrollen op een tablet in liggende stand). De knop komt er
              daarom pas bij vanaf 74rem; de actie staat ook in het uitklapmenu. */}
          <div className="ml-2 hidden min-[74rem]:block">
            <HeaderCta ctas={model.headerCtas} />
          </div>
          <MobileMenu
            items={model.items}
            ctas={[model.headerCtas.inschrijven, model.headerCtas.personeelAanvragen]}
            phone={{ ...model.actions.call, label: contact.phone }}
            whatsapp={model.actions.whatsappAlgemeen}
            logo={<Wordmark idSuffix="mobile-menu" />}
            labels={{ open: t("openMenu"), close: t("closeMenu"), title: t("mobileMenu"), home: t("homeAria") }}
          />
        </div>
      </div>
    </HeaderFrame>
  );
}
