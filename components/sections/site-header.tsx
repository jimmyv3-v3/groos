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
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPositioner,
  NavigationMenuPopup,
} from "@/components/ui/navigation-menu";
import { CtaButton } from "@/components/ui/cta-button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useScroll } from "@/components/ui/use-scroll";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";

const EASE = [0.22, 1, 0.36, 1] as const;

const subscribeNoop = () => () => {};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // true op de client, false tijdens server-rendering (nodig voor de portal).
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const scrolled = useScroll(10);
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
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
          scrolled || open
            ? "border-border bg-background/70 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/#top" aria-label={contact.name} className="shrink-0">
            <Wordmark idSuffix="header" />
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
                              className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                              strokeWidth={1.4}
                              aria-hidden
                            />
                            <span className="flex flex-col gap-1">
                              <span className="font-display text-sm font-medium text-foreground">
                                {t(`services.${s.slug}.title`)}
                              </span>
                              <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
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
                className="rounded-md px-3 py-2 text-sm tracking-wide text-muted-foreground transition-colors hover:bg-card/40 hover:text-brand-strong"
              >
                {t(`common.nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={contact.phoneHref}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand-strong"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {contact.phone}
            </a>
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-muted-foreground transition-colors hover:text-brand-strong"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
            </a>
            <LanguageToggle />
            <CtaButton href="/#contact" size="sm">
              {t("common.cta.requestQuote")}
            </CtaButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border/70 bg-card/40 text-foreground transition-colors hover:text-brand-strong lg:hidden"
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
                className="fixed inset-x-0 bottom-0 top-16 z-[45] bg-background/95 backdrop-blur-xl lg:hidden"
              >
                <motion.nav
                  aria-label={t("header.mobileMenu")}
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="flex h-full flex-col justify-between p-6"
                >
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                    <div className="border-b border-border/60 py-4">
                      <p className="font-display text-lg font-light tracking-tight text-foreground">
                        {t("common.nav.services")}
                      </p>
                      <div className="mt-2 flex flex-col">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/diensten/${s.slug}`}
                            onClick={() => setOpen(false)}
                            className="py-2 text-sm text-muted-foreground transition-colors hover:text-brand-strong"
                          >
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
                        className="border-b border-border/60 py-4 font-display text-lg font-light tracking-tight text-foreground transition-colors hover:text-brand-strong"
                      >
                        {t(`common.nav.${item.key}`)}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    <LanguageToggle className="self-start" />
                    <a
                      href={contact.phoneHref}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      {contact.phone}
                    </a>
                    <CtaButton
                      href="/#contact"
                      className="w-full"
                      onClick={() => setOpen(false)}
                    >
                      {t("common.cta.requestQuote")}
                    </CtaButton>
                  </div>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* Sticky mobile action bar at the bottom of the viewport */}
      <nav
        aria-label={t("header.quickContact")}
        className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      >
        <div className="glass-panel border-x-0 border-b-0 px-4 pb-[env(safe-area-inset-bottom,0.75rem)] pt-3">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={contact.phoneHref}
              aria-label={t("header.callAria", { phone: contact.phone })}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border/60 bg-card/60 px-5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              {t("common.cta.callUs")}
            </a>
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("header.whatsappAria")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border/60 bg-card/60 px-5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
              {t("common.cta.quote")}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
