import type { Metadata } from "next";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { CtaButton } from "@/components/ui/cta-button";
import { Link } from "@/i18n/navigation";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { cities, getCity } from "@/content/werkgebied";
import { breadcrumbLd, localizedPath, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "werkgebied.overview" });
  return pageMetadata({
    locale,
    path: "/werkgebied",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WerkgebiedOverview locale={locale} />;
}

function WerkgebiedOverview({ locale }: { locale: string }) {
  const t = useTranslations();
  const list = cities.map((c) => ({
    slug: c.slug,
    name: getCity(c.slug, locale)?.name ?? c.name,
    province: c.province,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("common.nav.home"), path: localizedPath(locale, "/") },
          { name: t("werkgebied.navLabel"), path: localizedPath(locale, "/werkgebied") },
        ])}
      />
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden pb-12 pt-32 sm:pt-40">
          <div
            aria-hidden="true"
            className="bg-grid pointer-events-none absolute inset-0 opacity-30"
          />
          <div className="container relative max-w-3xl">
            <nav
              aria-label={t("service.breadcrumbAria")}
              className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Link href="/" className="transition-colors hover:text-brand-strong">
                {t("common.nav.home")}
              </Link>
              <ChevronRight className="h-3 w-3 text-brand-subtle/60" aria-hidden="true" />
              <span className="text-foreground/80">{t("werkgebied.navLabel")}</span>
            </nav>
            <h1 className="mt-8 font-display text-4xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
              {t("werkgebied.overview.titleLead")}{" "}
              <span className="accent-text font-normal">
                {t("werkgebied.overview.titleAccent")}
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {t("werkgebied.overview.intro")}
            </p>
          </div>
        </section>

        <section className="relative pb-24 sm:pb-28">
          <div className="container">
            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <RevealItem key={c.slug} className="h-full">
                  <Link
                    href={`/werkgebied/${c.slug}`}
                    className="group relative flex h-full flex-col justify-between rounded-lg border border-border/70 bg-card/40 p-6 transition-all duration-500 hover:border-brand/50 hover:bg-card/70"
                  >
                    <div>
                      <MapPin className="h-6 w-6 text-brand" strokeWidth={1.4} aria-hidden="true" />
                      <p className="mt-4 font-display text-xl font-medium text-foreground">
                        {c.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{c.province}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-brand-strong">
                      {t("werkgebied.overview.viewCity", { city: c.name })}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>

            <div className="mt-14 rounded-xl border border-border/70 bg-card/40 p-8 text-center">
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("werkgebied.overview.notListed")}
              </p>
              <div className="mt-6 flex justify-center">
                <CtaButton href="/#contact" size="lg">
                  {t("werkgebied.overview.cta")}
                </CtaButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
