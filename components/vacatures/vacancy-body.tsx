import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";

type Props = { vacancy: VacancyDetail; locale: Locale };

/**
 * Vacaturetekst in vier secties (spec 06 §4.10). Database-inhoud krijgt onder
 * /en lang="nl"; de minimumleeftijdzin komt uit messages en houdt de paginataal.
 */
export async function VacancyBody({ vacancy: v, locale }: Props) {
  const t = await getTranslations({ locale, namespace: "vacatures.detail" });
  const dutch = locale === "en" ? "nl" : undefined;
  const pageLang = locale === "en" ? locale : undefined;
  const minAge = v.minAge18 && v.minAgeReason ? t(`minAge.${v.minAgeReason}`) : null;
  const extra = (v.extra ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const sections = [
    { id: "je-werkdag", title: t("sections.tasks"), items: v.tasks, tail: null as string | null, tailLang: undefined as string | undefined },
    { id: "wat-je-meebrengt", title: t("sections.requirements"), items: v.requirements, tail: minAge, tailLang: pageLang },
    { id: "wat-je-krijgt", title: t("sections.offer"), items: v.offer, tail: v.salaryNote, tailLang: undefined },
  ].filter((s) => s.items.length > 0 || s.tail);

  return (
    <div className="grid gap-10">
      {sections.map((s) => (
        <section key={s.id} aria-labelledby={s.id}>
          <h2 id={s.id} className="text-h3 sm:text-[1.5rem]">
            {s.title}
          </h2>
          <div className="prose-groos mt-4" lang={dutch}>
            <ul>
              {s.items.map((item, i) => (
                <li key={`${i}-${item}`}>{item}</li>
              ))}
              {s.tail && <li lang={s.tailLang}>{s.tail}</li>}
            </ul>
          </div>
        </section>
      ))}
      {extra.length > 0 && (
        <section aria-labelledby="meer-over-dit-werk">
          <h2 id="meer-over-dit-werk" className="text-h3 sm:text-[1.5rem]">
            {t("sections.extra")}
          </h2>
          <div className="prose-groos mt-4" lang={dutch}>
            {extra.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
