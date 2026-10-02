import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Statustabbladen als links met tellers (spec 08 §4.3). Opmaak naar 21st.dev
 * 24959 (lijnstijl, teller als pil); geen tabs-rol, want het zijn links.
 */
export function StatusTabs({
  tabs,
  activeKey,
  label,
}: {
  tabs: { key: string; label: string; count: number; href: string }[];
  activeKey: string;
  label: string;
}) {
  return (
    <nav aria-label={label} className="-mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-1 border-b border-border">
        {tabs.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <li key={tab.key} className="shrink-0">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "-mb-px inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs tabular-nums",
                    active ? "bg-brand-tint text-brand-strong" : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
