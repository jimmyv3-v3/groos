import { getLocale, getTranslations } from "next-intl/server";
import { getLegalDoc, type LegalDocId } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { Alert } from "@/components/ui/alert";
import { CtaButton } from "@/components/ui/cta-button";
import { LegalTable } from "@/components/legal/legal-table";
import { LegalText } from "@/components/legal/legal-text";
import { LegalToc } from "@/components/legal/legal-toc";

/** Tekst mag links bevatten als [label](href); zie LegalText. */
export type LegalBlock =
  | string
  | { list: string[] }
  | { table: { caption: string; head: string[]; rows: string[][] } };

export type LegalSection = {
  /** Stabiel anker, gelijk in nl en en, patroon ^[a-z0-9-]+$. */
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalContent = {
  title: string;
  metaDescription: string;
  intro: string;
  sections: LegalSection[];
};

/** Engelse inhoud bij "en", anders de Nederlandse. */
export function pickLegal(content: { nl: LegalContent; en: LegalContent }, locale: string): LegalContent {
  return locale === "en" ? content.en : content.nl;
}

const SECTION_ID = /^[a-z0-9-]+$/;
const TOC_MIN = 5;

function assertSectionIds(sections: LegalSection[]) {
  const seen = new Set<string>();
  for (const { id } of sections) {
    if (!SECTION_ID.test(id)) throw new Error(`LegalPage: ongeldige section.id "${id}"`);
    if (seen.has(id)) throw new Error(`LegalPage: dubbele section.id "${id}"`);
    seen.add(id);
  }
}

/**
 * Juridische pagina (spec 09 §4.2). De layout rendert header, main en footer;
 * dit is de inhoud: kruimelpad, kopband met versieregel, conceptmelding,
 * inhoudsopgave (vanaf vijf artikelen), genummerde artikelen en een contactblok.
 */
export async function LegalPage({
  doc,
  content,
  articlePrefix = "",
  download,
}: {
  doc: LegalDocId;
  content: LegalContent;
  articlePrefix?: string;
  download?: { href: string; label: string };
}) {
  if (process.env.NODE_ENV !== "production") assertSectionIds(content.sections);

  const [locale, t] = await Promise.all([getLocale(), getTranslations("legal")]);
  const meta = getLegalDoc(doc);
  const date = meta.updatedAt
    ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Amsterdam",
      }).format(new Date(`${meta.updatedAt}T12:00:00Z`))
    : null;

  const tocItems = content.sections.map((section, i) => ({
    id: section.id,
    number: String(i + 1),
    label: section.heading,
  }));
  const showToc = content.sections.length >= TOC_MIN;

  const articles = (
    <div className="prose-groos">
      {content.sections.map((section, i) => (
        <article
          key={section.id}
          id={section.id}
          className="mt-12 scroll-mt-28 first:mt-0 [&>*+*]:mt-4"
        >
          <h2 className="mt-0 text-h3 text-foreground">
            <span className="text-brand">
              {articlePrefix}
              {i + 1}.
            </span>{" "}
            {section.heading}
          </h2>
          {section.blocks.map((block, j) => {
            if (typeof block === "string") {
              return (
                <p key={j}>
                  <LegalText text={block} />
                </p>
              );
            }
            if ("list" in block) {
              return (
                <ul key={j}>
                  {block.list.map((item, k) => (
                    <li key={k}>
                      <LegalText text={item} />
                    </li>
                  ))}
                </ul>
              );
            }
            return <LegalTable key={j} {...block.table} />;
          })}
        </article>
      ))}
    </div>
  );

  return (
    <div className="container pt-8 pb-20 sm:pt-10 sm:pb-28">
      <Breadcrumbs items={[{ label: content.title, href: meta.path }]} />

      {/* Kopband */}
      <header className="mt-8 max-w-3xl sm:mt-10">
        <h1 className="text-h1">{content.title}</h1>
        <p className="mt-5 text-lead text-muted-foreground">{content.intro}</p>
        {date && (
          <p className="mt-5 text-sm text-muted-foreground">
            {t("versionLine", { version: meta.version, date })}
          </p>
        )}
        {meta.draft && (
          <Alert tone="neutral" className="mt-6">
            {t("draftNotice")}
          </Alert>
        )}
        {download && (
          <CtaButton href={download.href} variant="secondary" className="mt-6">
            {download.label}
          </CtaButton>
        )}
      </header>

      {/* Inhoudsopgave en artikelen */}
      {content.sections.length > 0 && <div className="mt-10 h-px bg-border sm:mt-12" />}
      {content.sections.length > 0 && (
        <div className="mt-10 sm:mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <div>
            {showToc && (
              <details className="group mb-10 rounded-xl border border-border lg:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  {t("toc.title")}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="size-5 shrink-0 text-brand motion-safe:transition-transform group-open:rotate-180"
                  >
                    <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div className="border-t border-border px-2 py-3">
                  <LegalToc items={tocItems} ariaLabel={t("toc.ariaLabel")} variant="inline" />
                </div>
              </details>
            )}
            {articles}
          </div>
          {showToc && (
            <aside className="hidden lg:block">
              {/* Op lage schermen past een lange inhoudsopgave niet; dan scrollt alleen dit blok. */}
              <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain pb-2">
                <p className="mb-3 text-sm font-semibold text-foreground">{t("toc.title")}</p>
                <LegalToc items={tocItems} ariaLabel={t("toc.ariaLabel")} variant="sidebar" />
              </div>
            </aside>
          )}
        </div>
      )}

      {/* Contactblok */}
      <div className="mt-16 max-w-[68ch] rounded-xl border border-border bg-ice p-6 sm:p-8">
        <p className="text-base text-foreground">{t("contactQuestion")}</p>
        <CtaButton href={ROUTES.contact} className="mt-5">
          {t("contactCta")}
        </CtaButton>
      </div>
    </div>
  );
}
