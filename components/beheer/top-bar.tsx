import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { beheerPaths } from "@/app/beheer/_lib/paths";
import { S } from "@/app/beheer/_strings";
import { BackButton } from "./back-button";

/**
 * Topbalk van 56 px met woordmerk en "Beheer"; op mobiel een terugknop op
 * detailpagina's (spec 08 §4.3). Zonder backHref bepaalt de terugknop het
 * bovenliggende pad zelf.
 */
export function TopBar({ title, backHref, withBack = false }: { title?: string; backHref?: string; withBack?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-2 pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] lg:px-6">
        {(withBack || backHref) && <BackButton href={backHref} />}
        <Link href={beheerPaths.home} aria-label={S.app.name} className="flex min-h-11 shrink-0 items-center gap-2">
          <Logo decorative className="h-8 w-auto" />
          <span className="rounded-md bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand-strong">{S.app.short}</span>
        </Link>
        {title && <span className="ml-2 min-w-0 truncate text-sm text-muted-foreground">{title}</span>}
      </div>
    </header>
  );
}
