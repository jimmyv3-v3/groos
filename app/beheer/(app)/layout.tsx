import { Suspense } from "react";
import { FlashToast } from "@/components/beheer/flash-toast";
import { MobileTabBar } from "@/components/beheer/mobile-tab-bar";
import { SidebarNav } from "@/components/beheer/sidebar-nav";
import { TopBar } from "@/components/beheer/top-bar";
import { getNavCounts } from "../_data/nav";
import { requireAdmin } from "../_lib/auth";
import { S } from "../_strings";

/** Shell van het beheer: een beheersessie en een actief profiel (spec 08 §4.4, B-62). */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireAdmin();
  const counts = await getNavCounts(ctx);

  return (
    <>
      <a
        href="#inhoud"
        className="sr-only z-70 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {S.app.skipLink}
      </a>
      <TopBar withBack />
      {/* 19rem: het langste item, "Personeelsaanvragen" met teller, past dan op één regel. */}
      <div className="lg:grid lg:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] border-r border-border bg-ice lg:block">
          <SidebarNav counts={counts} profile={{ displayName: ctx.profile.displayName, role: ctx.profile.role }} />
        </aside>
        <main id="inhoud" tabIndex={-1} className="mx-auto w-full max-w-[72rem] pt-6 pr-[max(1rem,env(safe-area-inset-right))] pb-[calc(7rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] focus:outline-none lg:px-8 lg:pt-8 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileTabBar counts={counts} />
      <Suspense>
        <FlashToast />
      </Suspense>
    </>
  );
}
