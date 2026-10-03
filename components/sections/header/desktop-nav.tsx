"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { isActive } from "@/lib/routes";
import type { ResolvedNavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

/**
 * Hoofdmenu vanaf lg (spec 01 §4.4): Vacatures, Werkzoekenden (paneel),
 * Werkgevers (paneel), Over ons, Contact. Panelen in twee kolommen: links de
 * vijf beroepen met icoon, rechts twee of drie acties, zonder beschrijvingen.
 * Zonder JavaScript (`noscript:`, media query `scripting: none`) zijn
 * Werkzoekenden en Werkgevers gewone links naar /werkzoekenden en /werkgevers.
 */
/** Actieve sectie: kleur plus streep onder de tekst (spec 02 §4.13), nooit alleen kleur. */
const ACTIVE =
  "data-[active]:bg-transparent data-[active]:text-brand-strong data-[active]:after:absolute data-[active]:after:inset-x-3 data-[active]:after:-bottom-px data-[active]:after:h-0.5 data-[active]:after:bg-brand hover:data-[active]:bg-muted";

export function DesktopNav({ items, ariaLabel }: { items: ResolvedNavItem[]; ariaLabel: string }) {
  const pathname = usePathname();

  return (
    <NavigationMenu aria-label={ariaLabel} className="hidden lg:flex">
      <NavigationMenuList>
        {items.map((item) => {
          const active = isActive(pathname, item.key);
          if (!item.panel) {
            return (
              <NavigationMenuItem key={item.key}>
                <NavigationMenuLink
                  render={<Link href={item.href} />}
                  active={active === "page"}
                  data-active={active ? "" : undefined}
                  className={cn(navigationMenuTriggerStyle(), "flex-row", ACTIVE)}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }
          const { panel } = item;
          return (
            <NavigationMenuItem key={item.key}>
              <NavigationMenuTrigger data-active={active ? "" : undefined} className={cn(ACTIVE, "noscript:hidden")}>
                {item.label}
              </NavigationMenuTrigger>
              {/* Zonder JavaScript opent het paneel niet; dan linkt het menu-item direct naar de doelgroeppagina. */}
              <Link
                href={item.href}
                aria-current={active === "page" ? "page" : undefined}
                data-active={active ? "" : undefined}
                className={cn(navigationMenuTriggerStyle(), "relative hidden flex-row noscript:inline-flex", ACTIVE)}
              >
                {item.label}
              </Link>
              <NavigationMenuContent>
                <div className="grid w-[37rem] grid-cols-[1fr_15.5rem] gap-2">
                  <ul aria-label={panel.beroepenLabel} className="grid content-start gap-0.5 p-1">
                    {panel.beroepen.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink
                          render={<Link href={link.href} />}
                          active={pathname === link.href}
                          closeOnClick
                          className="min-h-11 flex-row items-center gap-3 px-3 py-2 text-base text-foreground aria-[current=page]:text-brand-strong [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-brand"
                        >
                          {link.icon}
                          {link.label}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                  <ul className="grid content-start gap-1 rounded-lg bg-ice p-2">
                    {panel.links.map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <NavigationMenuLink
                          render={<Link href={link.href} />}
                          active={pathname === link.href}
                          closeOnClick
                          className={cn(
                            "min-h-11 flex-row items-center gap-2.5 whitespace-nowrap px-3 py-2 text-sm font-medium [&_svg]:size-4 [&_svg]:shrink-0",
                            link.emphasis
                              ? "bg-primary text-primary-foreground hover:bg-brand-strong hover:text-primary-foreground data-[active]:bg-brand-strong data-[active]:text-primary-foreground"
                              : "text-foreground hover:bg-background [&_svg]:text-brand",
                          )}
                        >
                          {link.icon}
                          {link.label}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
      <NavigationMenuPositioner>
        <NavigationMenuPopup />
      </NavigationMenuPositioner>
    </NavigationMenu>
  );
}
