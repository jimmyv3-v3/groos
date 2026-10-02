"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { nav, contact } from "@/lib/site";
import { services } from "@/content/services";
import { Wordmark } from "@/components/brand/wordmark";
import {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPositioner,
  NavigationMenuPopup,
} from "@/components/ui/navigation-menu";
import { CtaButton, ctaButtonVariants } from "@/components/ui/cta-button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useScroll } from "@/components/ui/use-scroll";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";

const subscribeNoop = () => () => {};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // true op de client, false tijdens server-rendering (nodig voor de portal).
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const scrolled = useScroll(8);
  const t = useTranslations();

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-16 border-b bg-background transition-colors duration-150 ease-brand",
          scrolled || open ? "border-border" : "border-transparent",
        )}
      >
        <div className="container flex h-full items-center justify-between gap-6">
          <Link href="/#top" aria-label={contact.name} className="shrink-0 rounded-sm">
            <Wordmark idSuffix="header" className="h-6.5 lg:h-7" />
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label={t("header.mainMenu")}
          >
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    {t("common.nav.services")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[min(92vw,640px)] gap-1 p-2 sm:grid-cols-2">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <NavigationMenuLink
                            render={<Link href={`/diensten/${s.slug}`} />}
                            className="flex-row items-start gap-3 p-3"
                          >
                            <s.icon
                              className="mt-0.5 size-5 shrink-0 text-brand"
                              aria-hidden
                            />
                            <span className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-foreground">
                                {t(`services.${s.slug}.title`)}
                              </span>
                              <span className="line-clamp-2 text-sm text-muted-foreground">
                                {t(`services.${s.slug}.summary`)}
                              </span>
                            </span>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuPositioner>
                <NavigationMenuPopup />
              </NavigationMenuPositioner>
            </NavigationMenu>

            {nav.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navigationMenuTriggerStyle()}
              >
                {t(`common.nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-1 lg:flex">
            <a
              href={contact.phoneHref}
              data-slot="cta-button"
              className={ctaButtonVariants({ variant: "ghost", size: "sm", className: "hidden tabular-nums xl:inline-flex" })}
            >
              <Phone className="text-brand" aria-hidden />
              {contact.phone}
            </a>
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              data-slot="cta-button"
              className={ctaButtonVariants({ variant: "ghost", size: "icon", className: "lg:size-10" })}
            >
              <MessageCircle className="text-brand" aria-hidden />
            </a>
            <LanguageToggle />
            <CtaButton href="/#contact" size="sm" className="ml-2">
              {t("common.cta.requestQuote")}
            </CtaButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
            data-slot="cta-button"
            className={ctaButtonVariants({ variant: "ghost", size: "icon", className: "-mr-2 lg:hidden" })}
          >
            <MenuToggleIcon open={open} className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu, rendered through a portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-x-0 bottom-0 top-16 z-45 bg-background lg:hidden"
              >
                <motion.nav
                  aria-label={t("header.mobileMenu")}
                  className="container flex h-full flex-col justify-between pt-2 pb-6"
                >
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                    <div className="border-b border-border py-4">
                      <p className="font-display text-h3 font-semibold text-foreground">
                        {t("common.nav.services")}
                      </p>
                      <div className="mt-2 flex flex-col">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/diensten/${s.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 py-3 pl-1 text-base text-foreground transition-colors hover:text-brand-strong"
                          >
                            <s.icon className="size-5 shrink-0 text-brand" aria-hidden />
                            {t(`services.${s.slug}.title`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {nav.slice(1).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="border-b border-border py-4 font-display text-h3 font-semibold text-foreground transition-colors hover:text-brand-strong"
                      >
                        {t(`common.nav.${item.key}`)}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 pt-4">
                    <LanguageToggle className="-ml-3 self-start" />
                    <CtaButton href={contact.phoneHref} variant="secondary" className="w-full">
                      <Phone className="text-brand" aria-hidden />
                      {t("common.cta.callUs")}
                    </CtaButton>
                    <CtaButton
                      href="/#contact"
                      className="w-full"
                      onClick={() => setOpen(false)}
                    >
                      {t("common.cta.requestQuote")}
                    </CtaButton>
                    <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <a href={contact.phoneHref} className="tabular-nums hover:text-brand-strong">
                        {contact.phone}
                      </a>
                      <a
                        href={contact.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-strong"
                      >
                        WhatsApp
                      </a>
                    </p>
                  </div>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* Vaste actiebalk onderaan op mobiel */}
      <nav
        aria-label={t("header.quickContact")}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <div className="grid grid-cols-2 gap-3">
          <CtaButton
            href={contact.phoneHref}
            variant="secondary"
            ariaLabel={t("header.callAria", { phone: contact.phone })}
          >
            <Phone className="text-brand" aria-hidden />
            {t("common.cta.callUs")}
          </CtaButton>
          <CtaButton
            href={contact.whatsappHref}
            external
            ariaLabel={t("header.whatsappAria")}
          >
            <MessageCircle aria-hidden />
            {t("common.cta.quote")}
          </CtaButton>
        </div>
      </nav>
    </>
  );
}
