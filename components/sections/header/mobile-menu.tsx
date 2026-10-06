"use client";

import { useState, type ReactNode } from "react";
import { Accordion } from "@base-ui-components/react/accordion";
import { Dialog } from "@base-ui-components/react/dialog";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { audienceFor, isActive } from "@/lib/routes";
import type { ResolvedAction, ResolvedLink, ResolvedNavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { CtaButton, ctaButtonVariants } from "@/components/ui/cta-button";
import { LanguageToggle } from "@/components/ui/language-toggle";

type MobileMenuProps = {
  items: ResolvedNavItem[];
  /** Twee knoppen onderaan: eerst secundair (Inschrijven), dan primair (Personeel aanvragen). */
  ctas: ResolvedLink[];
  phone: ResolvedAction;
  whatsapp: ResolvedAction;
  logo: ReactNode;
  labels: { open: string; close: string; title: string; home: string };
};

const ROW = "flex min-h-12 w-full items-center justify-between gap-3 border-b border-border py-4 font-display text-h3 font-semibold text-foreground transition-colors duration-150 hover:text-brand-strong aria-[current=page]:text-brand-strong motion-reduce:transition-none";
const SUB = "flex min-h-12 items-center gap-3 py-3 pl-1 text-base text-foreground transition-colors duration-150 hover:text-brand-strong aria-[current=page]:font-medium aria-[current=page]:text-brand-strong motion-reduce:transition-none [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-brand";

/**
 * Mobiel menu onder lg (spec 01 §4.5): modaal dialoogvenster op volledig scherm
 * met focusval, Escape, scrollvergrendeling en uitklapgroepen per doelgroep.
 * Gebouwd op base-ui Dialog en Accordion, met CSS-overgangen (geen framer-motion).
 *
 * Staand scrolt alleen de lijst en blijven de knoppen onderaan vast staan. Op
 * een laag scherm (short:, telefoon liggend) blijft er zo te weinig lijst over;
 * dan scrolt het hele venster, met de kopregel vast bovenaan en de twee
 * knoppen naast elkaar.
 */
export function MobileMenu({ items, ctas, phone, whatsapp, logo, labels }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Sluit na elke navigatie (ook terug- en vooruitknop): state bijwerken tijdens
  // het renderen in plaats van in een effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const audience = audienceFor(pathname);
  const defaultGroup = audience === "werkzoekende" ? ["werkzoekenden"] : audience === "werkgever" ? ["werkgevers"] : [];
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={labels.open}
        data-slot="cta-button"
        className={ctaButtonVariants({ variant: "ghost", size: "icon", className: "-mr-2 noscript:hidden lg:hidden" })}
      >
        <Menu aria-hidden />
      </Dialog.Trigger>
      {/* Zonder JavaScript opent het venster niet; de knop springt dan naar het linkoverzicht in de footer. */}
      <a
        href="#footermenu"
        aria-label={labels.open}
        data-slot="cta-button"
        className={cn(ctaButtonVariants({ variant: "ghost", size: "icon" }), "-mr-2 hidden noscript:inline-flex lg:noscript:hidden")}
      >
        <Menu aria-hidden />
      </a>
      <Dialog.Portal>
        <Dialog.Popup
          className="fixed inset-0 z-60 flex flex-col bg-background text-foreground outline-hidden short:overflow-y-auto short:overscroll-contain transition-[opacity,translate] duration-200 ease-brand data-[ending-style]:-translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-2 data-[starting-style]:opacity-0 motion-reduce:transition-none motion-reduce:duration-0 lg:hidden"
        >
          <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>
          <div className="container flex h-16 shrink-0 items-center justify-between gap-6 border-b border-border short:sticky short:top-0 short:z-10 short:bg-background">
            <Link href="/" aria-label={labels.home} onClick={close} className="flex min-h-11 shrink-0 items-center rounded-sm">
              {logo}
            </Link>
            <Dialog.Close
              aria-label={labels.close}
              data-slot="cta-button"
              className={ctaButtonVariants({ variant: "ghost", size: "icon", className: "-mr-2" })}
            >
              <X aria-hidden />
            </Dialog.Close>
          </div>

          <nav aria-label={labels.title} className="container min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 short:flex-none short:overflow-visible">
            <Accordion.Root defaultValue={defaultGroup} className="flex flex-col">
              {items.map((item) => {
                const active = isActive(pathname, item.key);
                if (!item.panel) {
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={close}
                      aria-current={active === "page" ? "page" : undefined}
                      className={ROW}
                    >
                      {item.label}
                    </Link>
                  );
                }
                const { panel } = item;
                return (
                  <Accordion.Item key={item.key} value={item.key} className="border-b border-border">
                    <Accordion.Header className="m-0">
                      <Accordion.Trigger className={cn(ROW, "group cursor-pointer border-b-0 text-left")}>
                        {item.label}
                        <ChevronDown
                          aria-hidden
                          className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-180 motion-reduce:transition-none"
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-brand data-[ending-style]:h-0 data-[starting-style]:h-0 motion-reduce:transition-none">
                      <ul aria-label={panel.beroepenLabel} className="flex flex-col">
                        {panel.beroepen.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} onClick={close} aria-current={pathname === link.href ? "page" : undefined} className={SUB}>
                              {link.icon}
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <ul className="mb-4 mt-1 flex flex-col border-t border-border pt-1">
                        {panel.links.map((link) => (
                          <li key={`${link.href}-${link.label}`}>
                            <Link
                              href={link.href}
                              onClick={close}
                              aria-current={pathname === link.href ? "page" : undefined}
                              className={cn(SUB, link.emphasis && "font-medium text-brand-strong")}
                            >
                              {link.icon}
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion.Root>
          </nav>

          <div className="container shrink-0 border-t border-border pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="grid gap-3 short:min-[30rem]:grid-cols-2">
              {ctas.map((cta, i) => (
                <CtaButton
                  key={cta.href}
                  href={cta.href}
                  onClick={close}
                  variant={i === 0 && ctas.length > 1 ? "secondary" : "primary"}
                  className="w-full"
                >
                  {cta.label}
                </CtaButton>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center gap-x-4">
                <a href={phone.href} aria-label={phone.ariaLabel} className="inline-flex min-h-11 items-center gap-1.5 tabular-nums hover:text-brand-strong [&_svg]:size-4 [&_svg]:text-brand">
                  {phone.icon}
                  {phone.label}
                </a>
                <a
                  href={whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={whatsapp.ariaLabel}
                  className="inline-flex min-h-11 items-center gap-1.5 hover:text-brand-strong [&_svg]:size-4 [&_svg]:text-brand"
                >
                  {whatsapp.icon}
                  {whatsapp.label}
                </a>
              </div>
              <LanguageToggle className="-mr-2" />
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
