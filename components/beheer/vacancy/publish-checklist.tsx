import type { PublishErrorCode } from "@/app/beheer/_lib/types";
import { S } from "@/app/beheer/_strings";
import { Alert } from "@/components/ui/alert";

const ANCHOR: Record<PublishErrorCode, string> = {
  title: "title",
  city: "city",
  hours: "hours_min",
  salary: "salary_min",
  intro: "intro",
  tasks: "tasks",
  requirements: "requirements",
  offer: "offer",
  start: "start_date",
  contact: "contact_admin_id",
  publish_at: "publicatie",
};

/** Wat nog ontbreekt om te publiceren, plus waarschuwingen zonder blokkade (spec 08 §4.3). */
export function PublishChecklist({ errors, warnings }: { errors: PublishErrorCode[]; warnings: string[] }) {
  if (errors.length === 0 && warnings.length === 0) return null;
  return (
    <div className="grid gap-3">
      {errors.length > 0 && (
        <Alert tone="warning" title={S.vacancies.form.checklistTitle}>
          <ul className="grid list-disc gap-1 pl-5">
            {errors.map((code) => (
              <li key={code}>
                <a href={`#veld-${ANCHOR[code]}`} className="underline underline-offset-4">
                  {S.validation.publish[code]}
                </a>
              </li>
            ))}
          </ul>
        </Alert>
      )}
      {warnings.length > 0 && (
        <Alert tone="info" title={S.vacancies.form.warningsTitle}>
          <ul className="grid list-disc gap-1 pl-5">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
}
