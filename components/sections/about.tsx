import { useTranslations } from "next-intl";
import { contact } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { Monogram } from "@/components/brand/monogram";

export function About() {
  const t = useTranslations("home.about");
  return (
    <section
      id="over-ons"
      className="relative scroll-mt-24 overflow-hidden border-y border-border/60 bg-card/20 py-16 sm:py-20"
    >
      {/* large watermark monogram */}
      <div className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 opacity-[0.06] lg:block">
        <Monogram idSuffix="about-mark" className="h-[28rem] w-auto" />
      </div>

      <div className="container relative">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-display text-2xl font-light leading-tight tracking-tight text-foreground sm:text-3xl">
              {t.rich("title", {
                accent: (chunks) => (
                  <span className="accent-text font-normal">{chunks}</span>
                ),
              })}
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 text-sm text-muted-foreground">
              {t("location", { city: contact.city })}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
