import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";
import { RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardTitle } from "@/components/ui/card";
import { CtaButton } from "@/components/ui/cta-button";

type Step = { title: string; body: string };

/**
 * Werkwijze in twee sporen van drie stappen (spec 04 §4.3.4): werkzoekenden
 * in je-vorm, werkgevers in u-vorm. De <ol> levert de nummering; het grote
 * cijfer is decoratief.
 */
export async function HowItWorks() {
  const [t, tCommon] = await Promise.all([getTranslations("home.steps"), getTranslations("common")]);
  const tracks = [
    {
      key: "jobseeker",
      title: t("jobseeker.title"),
      steps: t.raw("jobseeker.steps") as Step[],
      cta: { href: ROUTES.vacatures, label: tCommon("cta.viewJobs") },
    },
    {
      key: "employer",
      title: t("employer.title"),
      steps: t.raw("employer.steps") as Step[],
      cta: { href: ROUTES.personeelAanvragen, label: tCommon("cta.requestStaff") },
    },
  ] as const;

  return (
    <section id="zo-werkt-het" aria-labelledby="home-stappen-titel" className="bg-ice">
      <div className="container section">
        <SectionHeading headingId="home-stappen-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
        <div className="reveal-group mt-10 grid gap-4 lg:grid-cols-2 lg:gap-8">
          {tracks.map((track) => (
            <RevealItem key={track.key} className="flex">
              <Card className="w-full gap-6 p-6 md:p-8">
                <CardTitle as="h3">{track.title}</CardTitle>
                <ol className="grid gap-6">
                  {track.steps.map((step, i) => (
                    <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4">
                      <span
                        aria-hidden="true"
                        className="w-[1.2ch] font-display text-h1 leading-none text-brand-subtle tabular-nums"
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-display font-semibold">{step.title}</p>
                        <p className="mt-1 text-muted-foreground">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <CtaButton href={track.cta.href} variant="secondary" className="mt-auto w-full md:w-auto md:self-start">
                  {track.cta.label}
                </CtaButton>
              </Card>
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
