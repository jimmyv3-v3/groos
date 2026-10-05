import type { Metadata, Viewport } from "next";
import { brand } from "@/lib/brand";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import { S } from "./_strings";
import "../globals.css";

// Root-layout van Groos Beheer (spec 08 §4.4, spec 01 §4.21): alleen
// Nederlands, noindex, geen publieke header of footer, geen next-intl en geen
// Analytics. Alle pagina's zijn dynamisch, omdat ze cookies lezen.

export const metadata: Metadata = {
  title: { default: S.app.name, template: S.app.titleTemplate },
  robots: { index: false, follow: false, nocache: true },
  manifest: "/beheer/manifest.webmanifest",
  appleWebApp: { capable: true, title: S.app.name, statusBarStyle: "default" },
  applicationName: S.app.name,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: brand.colors.background,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function BeheerRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={cn(fontSans.variable, fontDisplay.variable, "scroll-pt-20 scroll-pb-28 lg:scroll-pb-8")}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <ToastProvider>
          {children}
          {/* Tot lg staat er een vaste balk onderaan (tabbalk of actiebalk); de melding blijft daarboven. */}
          <Toaster
            closeLabel={S.common.close}
            className="bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-6"
          />
        </ToastProvider>
      </body>
    </html>
  );
}
