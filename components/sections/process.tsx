import { useTranslations } from "next-intl";
import { steps } from "@/lib/site";
import { SectionHeading } from "./section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export function Process() {
  const t = useTranslations("home.process");
  const stepText = t.raw("steps") as { title: string; body: string }[];
  return (
    <section
      id="werkwijze"
      className="relative scroll-mt-24 border-y border-border/60 bg-card/20 py-16 sm:py-20"
    >
      <div className="container">
        <SectionHeading
          title={t("title")}
          accent={t("accent")}
          intro={t("intro")}
        />

        <RevealGroup className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <RevealItem key={s.n} className="relative text-center lg:text-left">
              <div className="flex items-center justify-center gap-4 lg:justify-start">
                <span className="font-display text-sm font-medium tracking-brand text-brand-subtle">
                  {s.n}
                </span>
                <div className="hidden h-px flex-1 bg-gradient-to-r from-border to-transparent lg:block" />
              </div>
              <s.icon
                className="mx-auto mt-6 h-7 w-7 text-brand lg:mx-0"
                strokeWidth={1.3}
              />
              <h3 className="mt-5 font-display text-lg font-medium text-foreground">
                {stepText[i].title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {stepText[i].body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
