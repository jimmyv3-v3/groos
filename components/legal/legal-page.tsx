import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * Shared layout for long-form legal pages (privacybeleid, algemene voorwaarden).
 * Renders the site chrome, a header band and a readable single-column document.
 * Content is passed as structured data so each page stays easy to edit.
 *
 * A block is either a paragraph (string) or a bullet list ({ list: [] }).
 */
export type LegalBlock = string | { list: string[] };
export type LegalSection = { heading: string; blocks: LegalBlock[] };

export function LegalPage({
  title,
  intro,
  updatedAt,
  sections,
  articlePrefix = "",
}: {
  title: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
  articlePrefix?: string;
}) {
  const t = useTranslations("legal");
  return (
    <>
      <SiteHeader />
      <main>
        {/* Header band */}
        <section className="relative overflow-hidden pb-14 pt-36 sm:pb-16 sm:pt-44">
          <div
            aria-hidden="true"
            className="bg-grid pointer-events-none absolute inset-0 opacity-30"
          />
          <div className="container relative max-w-3xl">
            <h1 className="font-display text-4xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {intro}
            </p>
            <p className="mt-6 text-sm text-muted-foreground/70">
              {t("updatedAt", { date: updatedAt })}
            </p>
          </div>
        </section>

        {/* Document body */}
        <section className="relative pb-28 sm:pb-32">
          <div className="container max-w-3xl">
            <div className="hairline mb-12" />
            <div className="space-y-12">
              {sections.map((section, i) => (
                <article key={section.heading} className="scroll-mt-28">
                  <h2 className="font-display text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                    <span className="text-brand-subtle">
                      {articlePrefix}
                      {i + 1}.
                    </span>{" "}
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {section.blocks.map((block, j) =>
                      typeof block === "string" ? (
                        <p key={j}>{block}</p>
                      ) : (
                        <ul key={j} className="space-y-2.5">
                          {block.list.map((item, k) => (
                            <li key={k} className="flex gap-3">
                              <span
                                aria-hidden="true"
                                className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-brand"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ),
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16 rounded-xl border border-border/70 bg-card/40 p-8 text-center">
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("contactQuestion")}
              </p>
              <div className="mt-6 flex justify-center">
                <CtaButton href="/#contact" size="lg">
                  {t("contactCta")}
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
