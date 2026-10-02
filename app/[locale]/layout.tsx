import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/locale";
import { pickClientMessages } from "@/i18n/client-messages";
import { contact } from "@/lib/site";
import { brand } from "@/lib/brand";
import { SITE_URL, organizationLd, websiteLd } from "@/lib/seo";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteActionBar } from "@/components/sections/site-action-bar";
import "../globals.css";

// Root-layout van de publieke site (spec 01 §4.22). /beheer krijgt een eigen
// root-layout (spec 08). Pagina's renderen geen <header>, <main> of <footer>.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: brand.colors.background,
};

// Standaardwaarden voor de hele site. Elke pagina zet daarnaast haar eigen
// titel, canonical, hreflang, robots en OG via pageMetadata() uit lib/seo.ts.
export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("titleDefault"), template: t("titleTemplate") },
    description: t("description"),
    applicationName: contact.shortName,
    publisher: contact.name,
    formatDetection: { telephone: false, email: false, address: false },
    // Geen robots hier: elke pagina zet ze via pageMetadata(), en de 404 krijgt
    // zo alleen de noindex van Next (anders twee tegenstrijdige robots-tags).
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const [t, tMeta, messages] = await Promise.all([
    getTranslations({ locale, namespace: "header" }),
    getTranslations({ locale, namespace: "meta" }),
    getMessages(),
  ]);

  return (
    <html lang={locale} className={cn(fontSans.variable, fontDisplay.variable)} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <a
          href="#inhoud"
          className="sr-only z-70 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t("skipLink")}
        </a>
        <JsonLd data={organizationLd({ description: tMeta("organizationDescription") })} />
        <JsonLd data={websiteLd({ locale })} />
        <NextIntlClientProvider messages={pickClientMessages(messages)}>
          <SiteHeader />
          <main id="inhoud" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <SiteFooter />
          <div aria-hidden className="h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden" />
          <SiteActionBar />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
