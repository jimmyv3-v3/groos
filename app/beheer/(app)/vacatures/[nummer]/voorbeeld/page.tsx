import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate, formatEuro } from "@/lib/format";
import { DefinitionList } from "@/components/beheer/definition-list";
import { PreviewBar } from "@/components/beheer/vacancy/preview-bar";
import { getVacancyPreview, getVacancyStatus } from "../../../../_data/vacancies";
import { requireAdmin } from "../../../../_lib/auth";
import { qualificationLabel } from "../../../../_lib/status";
import { S, fill } from "../../../../_strings";

function parseNumber(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n >= 1001 ? n : null;
}

export async function generateMetadata({ params }: PageProps<"/beheer/vacatures/[nummer]/voorbeeld">): Promise<Metadata> {
  const number = parseNumber((await params).nummer);
  return { title: number ? fill(S.vacancies.preview.metaTitle, { titel: fill(S.vacancies.number, { nummer: number }) }) : S.notFound.metaTitle };
}

const range = (min: string, max: string) => (min === max ? min : `${min}–${max}`);

/**
 * Voorbeeld van een vacature, ook voor concepten (spec 08 §4.7). Spec 06
 * levert (nog) geen herbruikbaar detailcomponent; daarom de eenvoudige
 * weergave uit §12: h1, feiten en de drie lijsten.
 */
export default async function VacancyPreviewPage({ params }: PageProps<"/beheer/vacatures/[nummer]/voorbeeld">) {
  const number = parseNumber((await params).nummer);
  if (!number) notFound();
  const ctx = await requireAdmin();
  const [v, status] = await Promise.all([getVacancyPreview(ctx, number), getVacancyStatus(ctx, number)]);
  if (!v || !status) notFound();
  const F = S.vacancies.form.fields;

  const facts = [
    { term: F.occupation_slug.label, value: v.occupation.nameNl },
    { term: F.city.label, value: v.locationLabel ?? v.city ?? S.common.notFilled },
    { term: F.contract_type.label, value: S.options.contractType[v.contractType] },
    { term: S.requests.detail.hours, value: v.hoursMin ? range(String(v.hoursMin), String(v.hoursMax)) : S.common.notFilled },
    {
      term: F.salary_min.label,
      value: v.salaryMin ? range(formatEuro(v.salaryMin, "nl"), formatEuro(v.salaryMax, "nl")) : S.common.notFilled,
    },
    { term: F.shifts.label, value: v.shifts.map((s) => S.options.shift[s]).join(", ") || S.common.notFilled },
    {
      term: F.start_date.label,
      value: v.startAsap ? F.start_asap.label : v.startDate ? formatDate(v.startDate, "nl") : S.common.notFilled,
    },
    ...(v.requiredQualifications.length
      ? [{ term: F.required_qualifications.label, value: v.requiredQualifications.map(qualificationLabel).join(", ") }]
      : []),
    ...(v.minAge18 && v.minAgeReason ? [{ term: F.min_age_18.label, value: S.options.minAgeReason[v.minAgeReason] }] : []),
    ...(v.contact ? [{ term: F.contact_admin_id.label, value: v.contact.name }] : []),
  ];

  const lists: { title: string; items: string[] }[] = [
    { title: F.tasks.label, items: v.tasks },
    { title: F.requirements.label, items: v.requirements },
    { title: F.offer.label, items: v.offer },
  ];

  return (
    <>
      <PreviewBar number={number} status={status} />
      <article className="grid max-w-3xl gap-8">
        <header className="grid gap-3">
          <p className="text-sm font-medium text-brand-strong">{v.occupation.nameNl}</p>
          <h1 className="text-[1.875rem] leading-tight lg:text-[2.5rem]">{v.title}</h1>
          {v.summary && <p className="text-lead text-muted-foreground">{v.summary}</p>}
        </header>
        <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <DefinitionList items={facts} />
        </section>
        {v.intro && <p className="text-base whitespace-pre-line">{v.intro}</p>}
        {lists
          .filter((l) => l.items.length > 0)
          .map((l) => (
            <section key={l.title} className="grid gap-3">
              <h2 className="text-[1.375rem] leading-snug">{l.title}</h2>
              <ul className="prose-groos list-disc pl-5">
                {l.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        {v.extra && (
          <section className="grid gap-3">
            <h2 className="text-[1.375rem] leading-snug">{F.extra.label}</h2>
            <p className="text-base whitespace-pre-line">{v.extra}</p>
          </section>
        )}
      </article>
    </>
  );
}
