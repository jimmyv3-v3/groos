import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { beheerPaths } from "@/app/beheer/_lib/paths";
import type { VacancyStatus } from "@/lib/data/options";
import { S } from "@/app/beheer/_strings";

/** Vaste balk bovenaan het voorbeeld met tekst en een link terug (spec 08 §4.3). */
export function PreviewBar({ number, status }: { number: number; status: VacancyStatus }) {
  const online = status === "published" || status === "closed";
  return (
    <div className="sticky top-14 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-info/25 bg-info-tint px-4 py-3 text-info-strong lg:-mx-6 lg:px-6">
      <Eye className="size-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{online ? S.vacancies.preview.bar : S.vacancies.preview.barDraft}</p>
      <Link href={beheerPaths.vacancy(number)} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold underline underline-offset-4">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {S.vacancies.preview.back}
      </Link>
    </div>
  );
}
