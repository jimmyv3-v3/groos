import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CircleCheck, MessageCircle, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BedanktReference } from "@/components/forms/bedankt-reference";
import { ServiceSteps } from "@/components/service/service-steps";
import type { StepItem } from "@/components/service/types";
import { CtaButton } from "@/components/ui/cta-button";
import { resolveLocale } from "@/i18n/locale";
import { isClaimConfirmed } from "@/lib/claims";
import { BEDANKT_SOORTEN, ROUTES, isBedanktSoort, paths, type BedanktSoort } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { contact, whatsappLink } from "@/lib/site";

// Bedankpagina's (spec 07 §4.10): statisch, noindex, follow en zonder
// kruimelpad. De referentie komt client-side uit ?ref=.
export const dynamicParams = false;
export const revalidate = false;

/** Route-soort naar sleutel in messages bedankt.<key> (spec 07). */
const KEYS = {
  sollicitatie: "application",
  inschrijving: "registration",
  aanvraag: "staffRequest",
  contact: "contact",
} as const satisfies Record<BedanktSoort, string>;

export function generateStaticParams() {
  return BEDANKT_SOORTEN.map((soort) => ({ soort }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/bedankt/[soort]">): Promise<Metadata> {
  const { locale: raw, soort } = await params;
  const locale = resolveLocale(raw);
  if (!isBedanktSoort(soort)) return {};
  const t = await getTranslations({ locale, namespace: "bedankt" });
  const key = KEYS[soort];
  return pageMetadata({
    locale,
    path: paths.bedankt(soort),
    title: t(`${key}.metaTitle`),
    description: t(`${key}.intro`),
    noindex: true,
  });
}

export default async function Page({ params }: PageProps<"/[locale]/bedankt/[soort]">) {
  const { locale: raw, soort } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  if (!isBedanktSoort(soort)) notFound();
  const [t, tc] = await Promise.all([
    getTranslations({ locale, namespace: "bedankt" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const key = KEYS[soort];
  const jobseeker = key === "application" || key === "registration";
  const staff = key === "staffRequest";

  return (
    <>
      <section className="pt-12 pb-6 sm:pt-16">
        <div className="container max-w-3xl">
          <span className="flex size-14 items-center justify-center rounded-full bg-brand-tint text-brand">
            <CircleCheck className="size-8" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-h1">{t(`${key}.title`)}</h1>
          <p className="mt-5 max-w-[60ch] text-lead text-muted-foreground">{t(`${key}.intro`)}</p>
          {key !== "contact" && (
            <Suspense fallback={null}>
              <BedanktReference
                template={t(`${key}.reference`, { reference: "__REF__" })}
                pattern={staff ? "P" : "S"}
              />
            </Suspense>
          )}
          <p className="mt-4 max-w-[60ch] text-base text-foreground">{t(`${key}.whoCalls`)}</p>

          {jobseeker && isClaimConfirmed("responseTime") && (
            <p className="mt-3 text-base text-muted-foreground">{tc("notes.responseJobseeker")}</p>
          )}
          {staff && (
            <div className="mt-6 grid gap-3 rounded-xl border border-border bg-ice p-4 sm:p-5">
              {isClaimConfirmed("responseTime") && (
                <p className="text-base text-muted-foreground">{tc("notes.responseEmployer")}</p>
              )}
              <p className="text-base font-medium text-foreground">{tc("notes.urgentEmployer")}</p>
              <div>
                <CtaButton variant="secondary" href={contact.phoneHref}>
                  <Phone aria-hidden="true" />
                  {tc("cta.call")}
                </CtaButton>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {jobseeker && (
              <>
                <CtaButton href={ROUTES.vacatures}>{tc("cta.viewJobs")}</CtaButton>
                <CtaButton
                  variant="secondary"
                  href={whatsappLink(tc("whatsapp.werkzoekende"))}
                  external
                  newTabLabel={tc("opensInNewTab")}
                >
                  <MessageCircle aria-hidden="true" />
                  {tc("cta.whatsapp")}
                </CtaButton>
              </>
            )}
            {staff && (
              <>
                <CtaButton
                  variant="secondary"
                  href={whatsappLink(tc("whatsapp.werkgever"))}
                  external
                  newTabLabel={tc("opensInNewTab")}
                >
                  <MessageCircle aria-hidden="true" />
                  {tc("cta.whatsapp")}
                </CtaButton>
                <CtaButton variant="link" href={ROUTES.werkgevers}>
                  {t("staffRequest.employersLink")}
                </CtaButton>
              </>
            )}
            {key === "contact" && (
              <>
                <CtaButton href={ROUTES.home}>{t("contact.homeLink")}</CtaButton>
                <CtaButton variant="secondary" href={ROUTES.vacatures}>
                  {tc("cta.viewJobs")}
                </CtaButton>
                <CtaButton variant="secondary" href={ROUTES.personeelAanvragen}>
                  {tc("cta.requestStaff")}
                </CtaButton>
              </>
            )}
          </div>
        </div>
      </section>

      {key !== "contact" && (
        <ServiceSteps
          id="zo-gaat-het"
          heading={t(`${key}.steps.title`)}
          accent={t(`${key}.steps.accent`)}
          steps={t.raw(`${key}.steps.items`) as StepItem[]}
        />
      )}
    </>
  );
}
