import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListChecks, Plus } from "lucide-react";
import { STAFF_REQUEST_STATUSES } from "@/lib/data/options";
import { formatDate } from "@/lib/format";
import { ActivityFeed } from "@/components/beheer/activity-feed";
import { AssignForm } from "@/components/beheer/assign-form";
import { ContactActions } from "@/components/beheer/contact-actions";
import { DefinitionList } from "@/components/beheer/definition-list";
import { DetailActionBar } from "@/components/beheer/detail-action-bar";
import { NoteForm } from "@/components/beheer/note-form";
import { PageHeader } from "@/components/beheer/page-header";
import { SectionCard } from "@/components/beheer/section-card";
import { StatusBadge } from "@/components/beheer/status-badge";
import { StatusForm } from "@/components/beheer/status-form";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { getStaffRequest } from "../../../_data/staff-requests";
import { listAdminOptions, listOccupationOptions } from "../../../_data/vacancies";
import { requireAdmin } from "../../../_lib/auth";
import { formatDateNl, formatPhoneNl } from "../../../_lib/format";
import { beheerPaths } from "../../../_lib/paths";
import { STAFF_REQUEST_REFERENCE } from "../../../_lib/validation/application";
import { S, fill } from "../../../_strings";

export async function generateMetadata({ params }: PageProps<"/beheer/aanvragen/[referentie]">): Promise<Metadata> {
  const { referentie } = await params;
  return { title: STAFF_REQUEST_REFERENCE.test(referentie) ? referentie : S.notFound.metaTitle };
}

/** Detail van een personeelsaanvraag (spec 08 §4.9). */
export default async function StaffRequestDetailPage({ params }: PageProps<"/beheer/aanvragen/[referentie]">) {
  const { referentie } = await params;
  if (!STAFF_REQUEST_REFERENCE.test(referentie)) notFound();
  const ctx = await requireAdmin();
  const [r, admins, occupations] = await Promise.all([
    getStaffRequest(ctx, referentie),
    listAdminOptions(ctx),
    listOccupationOptions(ctx),
  ]);
  if (!r) notFound();

  const D = S.requests.detail;
  const plural = new Map(occupations.map((o) => [o.slug as string, o.pluralNl]));
  const requested = [
    ...r.occupationSlugs.map((s) => plural.get(s) ?? s),
    ...(r.occupationOther ? [fill(S.requests.other, { tekst: r.occupationOther })] : []),
  ].join(", ");
  const whatsappText = fill(D.whatsappText, { naam: r.contactName, beheerder: ctx.profile.displayName, referentie: r.reference });
  const mailSubject = fill(D.mailSubject, { referentie: r.reference });

  const prefill = new URLSearchParams();
  if (r.occupationSlugs[0]) prefill.set("beroep", r.occupationSlugs[0]);
  prefill.set("plaats", r.workCity);
  if (r.hoursPerWeek) prefill.set("uren", String(r.hoursPerWeek));
  if (!r.startAsap && r.startDate) prefill.set("start", r.startDate);
  const createHref = `${beheerPaths.vacancyNew}?${prefill.toString().replace(/\+/g, "%20")}`;

  return (
    <>
      <PageHeader
        title={fill(D.title, { bedrijf: r.companyName })}
        meta={
          <>
            <StatusBadge kind="staffRequest" status={r.status} />
            <span>{fill(S.applications.detail.reference, { referentie: r.reference })}</span>
            <span>{fill(S.applications.detail.received, { datum: formatDateNl(r.createdAt) })}</span>
          </>
        }
        actions={
          <Link href={createHref} className={ctaButtonVariants({ variant: "secondary" })}>
            <Plus aria-hidden="true" />
            {D.createVacancy}
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="grid gap-6">
          <SectionCard id="contact" title={S.applications.detail.contact}>
            <DefinitionList
              items={[
                { term: S.requests.columns.contact, value: r.contactName },
                { term: S.applications.detail.phone, value: formatPhoneNl(r.phoneE164) },
                { term: S.applications.detail.email, value: r.email },
              ]}
            />
            <ContactActions
              entityType="staff_request"
              entityId={r.id}
              phoneE164={r.phoneE164}
              email={r.email}
              name={r.contactName}
              whatsappText={whatsappText}
              mailSubject={mailSubject}
              layout="inline"
            />
          </SectionCard>
          <SectionCard id="aanvraag" title={D.request}>
            <DefinitionList
              items={[
                { term: D.occupations, value: requested || S.common.notFilled },
                { term: D.headcount, value: r.headcount },
                { term: D.start, value: r.startAsap ? S.requests.asap : r.startDate ? formatDate(r.startDate, "nl") : S.common.notFilled },
                { term: D.duration, value: S.options.duration[r.duration] },
                { term: D.hours, value: r.hoursPerWeek ?? S.common.notFilled },
                { term: D.workCity, value: r.workCity },
                { term: D.kvk, value: r.kvkNumber ?? S.common.notFilled },
                { term: D.description, value: r.description ?? S.common.notFilled },
              ]}
            />
          </SectionCard>
          <SectionCard id="tijdlijn" title={S.applications.detail.timeline}>
            <NoteForm entityType="staff_request" entityId={r.id} />
            <ActivityFeed items={r.timeline} emptyText={S.empty.timeline} />
          </SectionCard>
        </div>
        <div className="lg:sticky lg:top-20">
          <SectionCard id="status" title={S.applications.detail.statusAndAssign}>
            <StatusForm kind="staffRequest" id={r.id} current={r.status} options={[...STAFF_REQUEST_STATUSES]} />
            <AssignForm kind="staffRequest" id={r.id} current={r.assignedTo} admins={admins} meId={ctx.userId} />
          </SectionCard>
        </div>
      </div>
      <DetailActionBar>
        <ContactActions
          entityType="staff_request"
          entityId={r.id}
          phoneE164={r.phoneE164}
          email={r.email}
          name={r.contactName}
          whatsappText={whatsappText}
          mailSubject={mailSubject}
          layout="bar"
        />
        <a href="#status" className="flex min-h-11 flex-col items-center justify-center gap-1 text-xs font-medium text-foreground hover:text-brand-strong">
          <ListChecks className="size-5 text-brand" aria-hidden="true" />
          {S.contact.status}
        </a>
      </DetailActionBar>
    </>
  );
}
