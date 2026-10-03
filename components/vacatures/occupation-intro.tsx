import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { OccupationSlug } from "@/lib/data/options";
import { paths } from "@/lib/routes";
import { lowerFirst } from "./vacancy-format";

type Props = { occupation: OccupationSlug; locale: Locale };

/** Korte beroepsintro boven de lijst bij precies één beroep (spec 06 E-06-08). */
export async function OccupationIntro({ occupation, locale }: Props) {
  const [t, tb] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.beroepIntro" }),
    getTranslations({ locale, namespace: "beroepen" }),
  ]);
  const name = lowerFirst(tb(`${occupation}.enkelvoud`), locale);
  const paragraphs = t.raw(`items.${occupation}.paragraphs`) as string[];
  const headingId = `beroep-intro-${occupation}`;

  return (
    <section aria-labelledby={headingId} className="rounded-2xl bg-brand-tint p-6">
      <h2 id={headingId} className="text-h3">
        {t("heading", { occupation: name })}
      </h2>
      <div className="mt-3 grid max-w-prose gap-3 text-foreground">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <Link
        href={paths.werkenAls(occupation)}
        className="link mt-3 inline-flex min-h-11 items-center gap-1.5 font-medium"
      >
        {t("link", { occupation: name })}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
