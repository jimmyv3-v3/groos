import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/reveal";
import { Monogram } from "@/components/brand/monogram";

export function Proof() {
  const t = useTranslations("home.proof");
  return (
    <section
      id="ervaring"
      aria-labelledby="proof-quote"
      className="relative border-y border-border/60 bg-card/20 py-16 sm:py-20"
    >
      <div className="container relative">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <figure className="flex flex-col items-center text-center">
              <Quote
                aria-hidden
                className="mb-8 h-10 w-10 text-brand-subtle"
              />
              <blockquote id="proof-quote">
                <p className="font-display text-h2 font-semibold text-foreground">
                  &ldquo;{t("quote")}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-10 flex flex-col items-center gap-4">
                <Monogram className="h-8 w-auto opacity-80" />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-display text-sm font-medium text-foreground">
                    {t("author")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("role")}
                  </span>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
