"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { signOut } from "@/app/beheer/_actions/auth";
import type { AdminRole, NavCounts } from "@/app/beheer/_lib/types";
import { S, fill } from "@/app/beheer/_strings";
import { cn } from "@/lib/utils";
import { countFor, isActive, SIDEBAR_ITEMS } from "./nav-items";

const itemClass =
  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-base transition-colors duration-150 motion-reduce:transition-none [&_svg]:size-5 [&_svg]:shrink-0";

/** Vaste sidebar vanaf lg (spec 08 §4.4); klapt niet in. */
export function SidebarNav({
  counts,
  profile,
}: {
  counts: NavCounts;
  profile: { displayName: string; role: AdminRole };
}) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col gap-6 p-3">
      <nav aria-label={S.nav.label}>
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const count = countFor(item, counts);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    itemClass,
                    active
                      ? "bg-brand-tint font-semibold text-brand-strong"
                      : "text-foreground hover:bg-muted hover:text-brand-strong",
                  )}
                >
                  <Icon aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {count > 0 && (
                    <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold tabular-nums text-primary-foreground">
                      <span aria-hidden="true">{count}</span>
                      <span className="sr-only">{fill(S.nav.newBadge, { aantal: count })}</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto grid gap-1 border-t border-border pt-4">
        <p className="px-3 pb-2">
          <span className="block text-base font-semibold">{profile.displayName}</span>
          <span className="block text-sm text-muted-foreground">
            {profile.role === "owner" ? S.app.roleOwner : S.app.roleRecruiter}
          </span>
        </p>
        <a href="/" target="_blank" rel="noopener noreferrer" className={cn(itemClass, "text-foreground hover:bg-muted")}>
          <ExternalLink aria-hidden="true" />
          {S.app.viewSite}
        </a>
        <form action={signOut}>
          <input type="hidden" name="scope" value="local" />
          <button type="submit" className={cn(itemClass, "w-full cursor-pointer text-foreground hover:bg-muted")}>
            <LogOut aria-hidden="true" />
            {S.app.signOut}
          </button>
        </form>
      </div>
    </div>
  );
}
