import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityFeed } from "@/components/beheer/activity-feed";
import { FlagBadge } from "@/components/beheer/flag-badge";
import { PageHeader } from "@/components/beheer/page-header";
import { SectionCard } from "@/components/beheer/section-card";
import { StatusBadge } from "@/components/beheer/status-badge";
import { PublishChecklist } from "@/components/beheer/vacancy/publish-checklist";
import { VacancyActions } from "@/components/beheer/vacancy/vacancy-actions";
import { VacancyForm } from "@/components/beheer/vacancy/vacancy-form";
import { getVacancyForEdit, listAdminOptions, listOccupationOptions } from "../../../_data/vacancies";
import { requireAdmin } from "../../../_lib/auth";
import { beheerPaths } from "../../../_lib/paths";
import { vacancyDisplayStatus } from "../../../_lib/status";
import type { VacancyActionTarget } from "../../../_lib/types";
import { vacancyWarnings } from "../../../_lib/validation/vacancy";
import { S, fill } from "../../../_strings";

function parseNumber(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n >= 1001 ? n : null;
}

export async function generateMetadata({ params }: PageProps<"/beheer/vacatures/[nummer]">): Promise<Metadata> {
  const number = parseNumber((await params).nummer);
  return { title: number ? fill(S.vacancies.number, { nummer: number }) : S.notFound.metaTitle };
}

/** Vacature bewerken in blokken (spec 08 §4.7). */
export default async function EditVacancyPage({ params }: PageProps<"/beheer/vacatures/[nummer]">) {
  const number = parseNumber((await params).nummer);
  if (!number) notFound();
  const ctx = await requireAdmin();
  const [vacancy, occupations, admins] = await Promise.all([
    getVacancyForEdit(ctx, number),
    listOccupationOptions(ctx),
    listAdminOptions(ctx),
  ]);
  if (!vacancy) notFound();

  const display = vacancyDisplayStatus({ status: vacancy.status, closesAt: vacancy.closesAt, closeReason: vacancy.closeReason });
  const showChecklist = vacancy.publishErrors.length > 0 && vacancy.status !== "archived";
  const warnings = vacancyWarnings(vacancy.form);
  const target: VacancyActionTarget = {
    id: vacancy.id,
    number: vacancy.number,
    title: vacancy.title,
    city: vacancy.city,
    slug: vacancy.slug,
    status: vacancy.status,
    closesAt: vacancy.closesAt,
    publishAt: vacancy.publishAt,
    isFeatured: vacancy.isFeatured,
    isUrgent: vacancy.isUrgent,
    applicationCount: vacancy.applicationCount,
    openApplicationCount: vacancy.openApplicationCount,
    publicState: vacancy.publicState,
  };

  return (
    <>
      <PageHeader
        title={vacancy.title || S.vacancies.newTitle}
        meta={
          <>
            <span>{fill(S.vacancies.number, { nummer: vacancy.number })}</span>
            <StatusBadge kind="vacancy" status={display} />
            {vacancy.isFeatured && <FlagBadge flag="featured" />}
            {vacancy.isUrgent && <FlagBadge flag="urgent" />}
          </>
        }
        actions={
          <VacancyActions
            variant="buttons"
            isOwner={ctx.profile.role === "owner"}
            vacancy={target}
          />
        }
      />
      {(showChecklist || warnings.length > 0) && (
        <div className="mb-6">
          <PublishChecklist errors={showChecklist ? vacancy.publishErrors : []} warnings={warnings} />
        </div>
      )}
      <VacancyForm
        mode="edit"
        id={vacancy.id}
        number={vacancy.number}
        initial={vacancy.form}
        occupations={occupations}
        admins={admins}
        status={vacancy.status}
        publishErrors={vacancy.publishErrors}
        updatedAt={vacancy.updatedAt}
        target={target}
      />
      <div className="mt-6 lg:mr-[14.5rem]">
        <SectionCard
          id="geschiedenis"
          title={S.vacancies.form.history}
          actions={
            vacancy.applicationCount > 0 ? (
              <Link href={`${beheerPaths.applications}?vacature=${vacancy.number}&tab=alle`} className="link inline-flex min-h-11 items-center text-sm">
                {`${S.vacancies.actions.viewApplications} (${vacancy.applicationCount})`}
              </Link>
            ) : undefined
          }
        >
          <ActivityFeed items={vacancy.history} emptyText={S.empty.history} />
        </SectionCard>
      </div>
    </>
  );
}
