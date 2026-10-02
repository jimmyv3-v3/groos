"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavCounts } from "@/app/beheer/_lib/types";
import { S, fill } from "@/app/beheer/_strings";
import { cn } from "@/lib/utils";
import { countFor, isActive, TAB_ITEMS } from "./nav-items";

/**
 * Vaste tabbalk onder lg met vijf items, altijd icoon en label (spec 08
 * §4.4). Verborgen zodra de pagina een [data-actiebalk] heeft.
 */
export function MobileTabBar({ counts }: { counts: NavCounts }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={S.nav.tabBarLabel}
      data-tabbalk
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden [body:has([data-actiebalk])_&]:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-xl grid-cols-5">
        {TAB_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const count = countFor(item, counts);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors duration-150 motion-reduce:transition-none",
                  active ? "font-semibold text-brand-strong" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "relative inline-grid h-7 w-12 place-items-center rounded-full",
                    active && "bg-brand-tint",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {count > 0 && (
                    <span className="absolute -top-1 right-0 min-w-5 rounded-full bg-primary px-1 text-center text-[0.6875rem] leading-5 font-semibold tabular-nums text-primary-foreground">
                      <span aria-hidden="true">{count}</span>
                      <span className="sr-only">{fill(S.nav.newBadge, { aantal: count })}</span>
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
