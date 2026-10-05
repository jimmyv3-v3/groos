import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListChecks } from "lucide-react";
import { APPLICATION_STATUSES } from "@/lib/data/options";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { ActivityFeed } from "@/components/beheer/activity-feed";
import { AssignForm } from "@/components/beheer/assign-form";
import { ContactActions, ContactLink } from "@/components/beheer/contact-actions";
import { CvButtons } from "@/components/beheer/cv-buttons";
import { DefinitionList } from "@/components/beheer/definition-list";
import { DetailActionBar } from "@/components/beheer/detail-action-bar";
import { NoteForm } from "@/components/beheer/note-form";
import { PageHeader } from "@/components/beheer/page-header";
import { rowLinkClass } from "@/components/beheer/responsive-list";
import { SectionCard } from "@/components/beheer/section-card";
import { StatusBadge } from "@/components/beheer/status-badge";
import { StatusForm } from "@/components/beheer/status-form";
import { getApplication } from "../../../_data/applications";
import { listAdminOptions, listOccupationOptions } from "../../../_data/vacancies";
import { requireAdmin } from "../../../_lib/auth";
import { formatDateNl, formatPhoneNl, formatRelativeNl, mailtoHref, telHref } from "../../../_lib/format";
import { beheerPaths } from "../../../_lib/paths";
import { APPLICATION_REFERENCE } from "../../../_lib/validation/application";
import { S, fill } from "../../../_strings";

export async function generateMetadata({ params }: PageProps<"/beheer/sollicitaties/[referentie]">): Promise<Metadata> {
  const { referentie } = await params;
  return { title: APPLICATION_REFERENCE.test(referentie) ? referentie : S.notFound.metaTitle };
}

/** Detail van een sollicitatie (spec 08 §4.8). */
export default async function ApplicationDetailPage({ params }: PageProps<"/beheer/sollicitaties/[referentie]">) {
  const { referentie } = await params;
  if (!APPLICATION_REFERENCE.test(referentie)) notFound();
  const ctx = await requireAdmin();
  const [a, admins, occupations] = await Promise.all([
    getApplication(ctx, referentie),
    listAdminOptions(ctx),
    listOccupationOptions(ctx),
  ]);
  if (!a) notFound();

  const D = S.applications.detail;
  const occupationName = new Map(occupations.map((o) => [o.slug as string, o.nameNl]));
  const whatsappText =
    a.kind === "registration"
      ? fill(D.whatsappTextRegistration, { voornaam: a.firstName, beheerder: ctx.profile.displayName })
      : fill(D.whatsappText, { voornaam: a.firstName, beheerder: ctx.profile.displayName, vacature: a.vacancyTitle ?? "" });
  const mailSubject = a.kind === "registration" ? D.mailSubjectRegistration : D.mailSubject;
  const yesNo = (v: boolean | null) => (v === null ? S.common.notFilled : v ? S.common.yes : S.common.no);

  const details = [
    { term: D.mayWork, value: yesNo(a.mayWorkInNl) },
    { term: D.availableFrom, value: a.availableFrom ? formatDate(a.availableFrom, "nl") : S.common.notFilled },
    ...(a.hasDrivingLicenseB !== null ? [{ term: D.drivingLicense, value: yesNo(a.hasDrivingLicenseB) }] : []),
    ...(a.occupationSlugs.length
      ? [{ term: D.occupations, value: a.occupationSlugs.map((s) => occupationName.get(s) ?? s).join(", ") }]
      : []),
    { term: D.message, value: a.message ?? S.common.notFilled },
    { term: D.language, value: S.options.locale[a.locale] },
    {
      term: D.consent,
      value: a.retentionConsent && a.retentionConsentAt ? fill(D.consentGiven, { datum: formatDateNl(a.retentionConsentAt) }) : S.common.no,
    },
  ];

  return (
    <>
      <PageHeader
        title={fill(D.title, { naam: a.fullName })}
        meta={
          <>
            <StatusBadge kind="application" status={a.status} />
            <span>{fill(D.reference, { referentie: a.reference })}</span>
            <span>{fill(D.received, { datum: formatDateNl(a.createdAt) })}</span>
            <span>{fill(D.source, { bron: S.options.source[a.source] })}</span>
            {a.kind === "registration" ? (
              <span>{S.applications.registration}</span>
            ) : a.vacancyNumber ? (
              <Link href={beheerPaths.vacancy(a.vacancyNumber)} className="link -my-2 inline-flex min-h-11 items-center">
                {a.vacancyTitle ?? fill(S.vacancies.number, { nummer: a.vacancyNumber })}
              </Link>
            ) : null}
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="grid gap-6">
          <SectionCard id="contact" title={D.contact}>
            <DefinitionList
              items={[
                {
                  term: D.phone,
                  value: a.phoneE164 ? (
                    <ContactLink entityType="application" entityId={a.id} channel="call" href={telHref(a.phoneE164)}>
                      {formatPhoneNl(a.phoneE164)}
                    </ContactLink>
                  ) : (
                    S.common.notFilled
                  ),
                },
                {
                  term: D.email,
                  value: a.email ? (
                    <ContactLink entityType="application" entityId={a.id} channel="email" href={mailtoHref(a.email, mailSubject)}>
                      {a.email}
                    </ContactLink>
                  ) : (
                    S.common.notFilled
                  ),
                },
                { term: D.city, value: a.city ?? S.common.notFilled },
              ]}
            />
            <ContactActions
              entityType="application"
              entityId={a.id}
              phoneE164={a.phoneE164}
              email={a.email}
              name={a.fullName}
              whatsappText={whatsappText}
              mailSubject={mailSubject}
              layout="inline"
            />
          </SectionCard>
          <SectionCard id="gegevens" title={D.details}>
            <DefinitionList items={details} />
          </SectionCard>
          <SectionCard id="cv" title={D.cv}>
            {a.hasCv ? (
              <CvButtons applicationId={a.id} filename={a.cvFilename} mime={a.cvMime} sizeBytes={a.cvSize} />
            ) : (
              <p className="text-base text-muted-foreground">{S.empty.noCv}</p>
            )}
          </SectionCard>
          <SectionCard id="tijdlijn" title={D.timeline}>
            <NoteForm entityType="application" entityId={a.id} />
            <ActivityFeed items={a.timeline} emptyText={S.empty.timeline} />
          </SectionCard>
        </div>
        <div className="grid gap-6 lg:sticky lg:top-20">
          <SectionCard id="status" title={D.statusAndAssign}>
            <StatusForm kind="application" id={a.id} current={a.status} options={[...APPLICATION_STATUSES]} canEmail={Boolean(a.email)} />
            <AssignForm kind="application" id={a.id} current={a.assignedTo} admins={admins} meId={ctx.userId} />
          </SectionCard>
          <SectionCard id="andere" title={D.others}>
            {a.others.length === 0 ? (
              <p className="text-base text-muted-foreground">{S.empty.others}</p>
            ) : (
              <ul className="divide-y divide-border">
                {a.others.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-x-2 py-1">
                    <Link href={beheerPaths.application(o.reference)} className={cn(rowLinkClass(), "inline-flex min-h-11 items-center")}>
                      {o.kind === "registration" ? S.applications.registration : (o.vacancyTitle ?? o.reference)}
                    </Link>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      {formatRelativeNl(o.createdAt)}
                      <StatusBadge kind="application" status={o.status} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">{fill(D.retention, { datum: formatDateNl(a.retainUntil) })}</p>
      <DetailActionBar>
        <ContactActions
          entityType="application"
          entityId={a.id}
          phoneE164={a.phoneE164}
          email={a.email}
          name={a.fullName}
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
