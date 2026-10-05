import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { beroepen } from "@/content/beroepen";
import { paths } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { bentoSlot, type BentoSlot } from "@/components/beroep/bento";
import { RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { GridPattern } from "@/components/ui/grid-pattern";
import { IconTile } from "@/components/ui/icon-tile";
import { occupationPhrase } from "@/i18n/occupation-phrase";

/**
 * Bento vanaf lg (naar 21st.dev 622): brede kaarten boven en onder, rijen van
 * drie smalle ertussen (zie bentoSlot). Op md twee kolommen; bij een oneven
 * aantal loopt de laatste kaart daar over de volle breedte.
 */
const SPAN: Record<BentoSlot, string> = { wide: "lg:col-span-6", narrow: "lg:col-span-4", full: "lg:col-span-12" };

const LINK_CLASS =
  "group/link flex min-h-12 items-center justify-between gap-3 px-6 py-3 text-sm font-medium text-foreground transition-colors duration-150 ease-brand hover:bg-brand-tint hover:text-brand-strong focus-visible:-outline-offset-2 md:px-7";

/**
 * De beroepen met per kaart een link voor werkzoekenden en een voor
 * opdrachtgevers (spec 04 §4.3.3). De kaart zelf is niet klikbaar; de twee
 * perspectieven staan als rijen in de voet van de kaart.
 */
export async function HomeBeroepen() {
  const [locale, t, tBeroepen] = await Promise.all([
    getLocale(),
    getTranslations("home.beroepen"),
    getTranslations("beroepen"),
  ]);

  return (
    <section id="beroepen" aria-labelledby="home-beroepen-titel">
      <div className="container section">
        <SectionHeading headingId="home-beroepen-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
        <ul role="list" className="reveal-group mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {beroepen.map(({ id, icon }, i) => {
            const enkelvoud = tBeroepen(`${id}.enkelvoud`);
            const meervoud = tBeroepen(`${id}.meervoud`);
            const slot = bentoSlot(i, beroepen.length);
            const featured = slot !== "narrow";
            const lastOdd = beroepen.length % 2 === 1 && i === beroepen.length - 1;
            return (
              <RevealItem as="li" key={id} className={cn("flex", lastOdd && "md:col-span-2", SPAN[slot])}>
                <div
                  data-slot="card"
                  className="relative isolate flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground transition-[border-color,box-shadow,translate] duration-200 ease-brand hover:border-border-strong hover:shadow-md motion-safe:hover:-translate-y-0.5"
                >
                  {featured && <GridPattern variant="dots" fade="top-right" className="max-lg:hidden" />}
                  <div className={cn("flex flex-1 flex-col gap-3 p-6 md:p-7", featured && "lg:pb-9")}>
                    <IconTile icon={icon} size={featured ? "lg" : "md"} className={cn(featured && "max-lg:size-11 max-lg:rounded-lg max-lg:[&_svg]:size-5")} />
                    <CardTitle as="h3" className="mt-2">
                      {enkelvoud}
                    </CardTitle>
                    <CardDescription className="max-w-[48ch]">{t(`items.${id}.body`)}</CardDescription>
                  </div>
                  <div
                    className={cn(
                      "grid divide-y divide-border border-t border-border",
                      featured && "lg:grid-cols-2 lg:divide-x lg:divide-y-0",
                    )}
                  >
                    <Link href={paths.werkenAls(id)} className={LINK_CLASS}>
                      {t("jobseekerLink", { occupation: occupationPhrase(enkelvoud, locale) })}
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-brand transition-transform duration-150 ease-brand group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                      />
                    </Link>
                    <Link href={paths.werkgeverBeroep(id)} className={LINK_CLASS}>
                      {t("employerLink", { occupationPlural: meervoud.toLocaleLowerCase(locale) })}
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-brand transition-transform duration-150 ease-brand group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                      />
                    </Link>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
