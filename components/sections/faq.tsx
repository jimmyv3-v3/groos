import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/reveal";

export default function Faq() {
  const t = useTranslations("home");
  const items = t.raw("faq.items") as { q: string; a: string }[];
  return (
    <section
      aria-labelledby="faq-heading"
      className="relative py-16 sm:py-20 border-y border-border/60 bg-card/20"
    >
      <div className="container relative">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2
              id="faq-heading"
              className="mb-12 text-h2"
            >
              {t("faq.heading")}{" "}
              <span className="accent-text">
                {t("faq.headingAccent")}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              {items.map((faq, index) => (
                <details
                  key={index}
                  className="group border-b border-border/60 py-2"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-h3 font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-brand transition-transform duration-300 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
