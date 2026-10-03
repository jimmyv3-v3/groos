import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { beroepen } from "@/content/beroepen";
import { paths } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";

/** Kolombreedte per kaart vanaf lg: rij van drie, dan rij van twee (spec 04 §4.3.3). */
const SPANS = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "md:col-span-2 lg:col-span-3"];

/**
 * Vijf beroepen met per kaart een link voor werkzoekenden en een voor
 * opdrachtgevers (spec 04 §4.3.3). De kaart zelf is niet klikbaar.
 */
export async function HomeBeroepen() {
  const [locale, t, tBeroepen] = await Promise.all([
    getLocale(),
    getTranslations("home.beroepen"),
    getTranslations("beroepen"),
  ]);
  const linkClass =
    "link group/link inline-flex min-h-11 items-center gap-2 font-medium";

  return (
    <section id="beroepen" aria-labelledby="home-beroepen-titel">
      <div className="container section">
        <SectionHeading headingId="home-beroepen-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
        <ul role="list" className="reveal-group mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {beroepen.map(({ id, icon }, i) => {
            const enkelvoud = tBeroepen(`${id}.enkelvoud`);
            const meervoud = tBeroepen(`${id}.meervoud`);
            return (
              <RevealItem as="li" key={id} className={cn("flex", SPANS[i])}>
                <Card className="w-full gap-3">
                  <div className="flex items-center gap-3">
                    <IconTile icon={icon} />
                    <CardTitle as="h3">{enkelvoud}</CardTitle>
                  </div>
                  <CardDescription>{t(`items.${id}.body`)}</CardDescription>
                  <div className="mt-auto flex flex-col pt-1">
                    <Link href={paths.werkenAls(id)} className={linkClass}>
                      {t("jobseekerLink", { occupation: enkelvoud.toLocaleLowerCase(locale) })}
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform duration-150 ease-brand group-hover/link:translate-x-0.5"
                      />
                    </Link>
                    <Link href={paths.werkgeverBeroep(id)} className={linkClass}>
                      {t("employerLink", { occupationPlural: meervoud.toLocaleLowerCase(locale) })}
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform duration-150 ease-brand group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </Card>
              </RevealItem>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
