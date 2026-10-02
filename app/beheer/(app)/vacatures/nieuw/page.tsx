import type { Metadata } from "next";
import { OCCUPATION_SLUGS } from "@/lib/data/options";
import { PageHeader } from "@/components/beheer/page-header";
import { VacancyForm } from "@/components/beheer/vacancy/vacancy-form";
import { listAdminOptions, listOccupationOptions } from "../../../_data/vacancies";
import { requireAdmin } from "../../../_lib/auth";
import { oneOf } from "../../../_lib/url";
import { firstParam } from "../../../_lib/validation/common";
import { emptyVacancyValues } from "../../../_lib/validation/vacancy";
import { S } from "../../../_strings";

export const metadata: Metadata = { title: S.vacancies.newTitle };

/**
 * Nieuwe vacature (spec 08 §4.7). Voorinvullen vanuit een aanvraag met
 * ?beroep=&plaats=&uren=&start=.
 */
export default async function NewVacancyPage({ searchParams }: PageProps<"/beheer/vacatures/nieuw">) {
  const ctx = await requireAdmin();
  const params = await searchParams;
  const [occupations, admins] = await Promise.all([listOccupationOptions(ctx), listAdminOptions(ctx)]);

  const initial = emptyVacancyValues(admins.some((a) => a.id === ctx.userId) ? ctx.userId : "");
  const beroep = oneOf(params.beroep, OCCUPATION_SLUGS);
  if (beroep) initial.occupation_slug = beroep;
  const plaats = firstParam(params.plaats)?.trim().slice(0, 80);
  if (plaats) initial.city = plaats;
  const uren = firstParam(params.uren);
  if (uren && /^\d{1,2}$/.test(uren) && Number(uren) >= 1 && Number(uren) <= 60) {
    initial.hours_min = uren;
    initial.hours_max = uren;
  }
  const start = firstParam(params.start);
  if (start && /^\d{4}-\d{2}-\d{2}$/.test(start)) {
    initial.start_asap = false;
    initial.start_date = start;
  }

  return (
    <>
      <PageHeader title={S.vacancies.newTitle} />
      <VacancyForm
        mode="create"
        id={null}
        number={null}
        initial={initial}
        occupations={occupations}
        admins={admins}
        status={null}
        publishErrors={[]}
        updatedAt={null}
      />
    </>
  );
}
