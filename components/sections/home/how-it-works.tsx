import type { LucideIcon } from "lucide-react";
import { Building2, UserRound } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardTitle } from "@/components/ui/card";
import { CtaButton } from "@/components/ui/cta-button";
import { IconTile } from "@/components/ui/icon-tile";
import { StaffingFlow } from "./staffing-flow";

type Step = { title: string; body: string };
type Track = { key: string; icon: LucideIcon; title: string; steps: Step[]; cta: { href: string; label: string } };

/**
 * Werkwijze in twee sporen van drie stappen (spec 04 §4.3.4): werkzoekenden
 * in je-vorm, werkgevers in u-vorm. De <ol> levert de nummering; het cijfer in
 * de cirkel is decoratief en de lijn ertussen verbindt de stappen (naar
 * 21st.dev 26891). Naast de kop staat de visual StaffingFlow als eigen blok.
 */
export async function HowItWorks() {
  const [rawLocale, t, tCommon] = await Promise.all([
    getLocale(),
    getTranslations("home.steps"),
    getTranslations("common"),
  ]);
  const locale = resolveLocale(rawLocale);
  const tracks: Track[] = [
    {
      key: "jobseeker",
      icon: UserRound,
      title: t("jobseeker.title"),
      steps: t.raw("jobseeker.steps") as Step[],
      cta: { href: ROUTES.vacatures, label: tCommon("cta.viewJobs") },
    },
    {
      key: "employer",
      icon: Building2,
      title: t("employer.title"),
      steps: t.raw("employer.steps") as Step[],
      cta: { href: ROUTES.personeelAanvragen, label: tCommon("cta.requestStaff") },
    },
  ];

  return (
    <section id="zo-werkt-het" aria-labelledby="home-stappen-titel">
      <div className="container section">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading headingId="home-stappen-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
          <Reveal className="mx-auto w-full max-w-xl lg:max-w-none">
            <StaffingFlow locale={locale} />
          </Reveal>
        </div>
        <div className="reveal-group mt-10 grid gap-4 lg:mt-14 lg:grid-cols-2 lg:gap-5">
          {tracks.map((track) => (
            <RevealItem key={track.key} className="flex">
              <Card className="w-full gap-0 p-0 md:p-0">
                <div className="flex items-center gap-3 border-b border-border px-6 py-5 md:px-8">
                  <IconTile icon={track.icon} />
                  <CardTitle as="h3">{track.title}</CardTitle>
                </div>
                <ol className="px-6 pt-6 md:px-8 md:pt-8">
                  {track.steps.map((step, i) => (
                    <li key={step.title} className="relative grid grid-cols-[auto_1fr] gap-x-4 pb-7 last:pb-0">
                      {i < track.steps.length - 1 && (
                        <span aria-hidden="true" className="absolute top-9 bottom-0 left-[1.125rem] w-px -translate-x-1/2 bg-border" />
                      )}
                      <span
                        aria-hidden="true"
                        className="relative grid size-9 place-items-center rounded-full border border-border-strong bg-card font-display text-sm font-semibold text-brand tabular-nums"
                      >
                        {i + 1}
                      </span>
                      <div className="pt-1">
                        <p className="font-display text-h3 font-semibold text-foreground">{step.title}</p>
                        <p className="mt-1.5 text-muted-foreground">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-auto px-6 pt-7 pb-6 md:px-8 md:pb-8">
                  <CtaButton href={track.cta.href} variant="secondary" className="w-full md:w-auto">
                    {track.cta.label}
                  </CtaButton>
                </div>
              </Card>
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
