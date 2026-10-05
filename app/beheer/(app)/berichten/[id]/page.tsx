import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityFeed } from "@/components/beheer/activity-feed";
import { ContactActions, ContactLink } from "@/components/beheer/contact-actions";
import { DefinitionList } from "@/components/beheer/definition-list";
import { MessageStatusButtons } from "@/components/beheer/message-status-buttons";
import { PageHeader } from "@/components/beheer/page-header";
import { SectionCard } from "@/components/beheer/section-card";
import { StatusBadge } from "@/components/beheer/status-badge";
import { getMessage } from "../../../_data/messages";
import { requireAdmin } from "../../../_lib/auth";
import { formatDateTimeNl, formatPhoneNl, mailtoHref, telHref } from "../../../_lib/format";
import { S, fill } from "../../../_strings";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const metadata: Metadata = { title: S.messages.metaTitle };

/** Detail van een bericht (spec 08 §4.10). */
export default async function MessageDetailPage({ params }: PageProps<"/beheer/berichten/[id]">) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const ctx = await requireAdmin();
  const m = await getMessage(ctx, id);
  if (!m) notFound();
  const D = S.messages.detail;

  return (
    <>
      <PageHeader title={fill(D.title, { naam: m.name })} meta={<StatusBadge kind="message" status={m.status} />} />
      <div className="grid max-w-3xl gap-6">
        <SectionCard id="bericht" title={S.messages.title}>
          {m.topic === "callback" && <p className="text-base font-medium text-brand-strong">{D.callback}</p>}
          <DefinitionList
            items={[
              { term: S.messages.columns.topic, value: S.options.topic[m.topic] },
              {
                term: S.applications.detail.phone,
                value: m.phoneE164 ? (
                  <ContactLink entityType="contact_message" entityId={m.id} channel="call" href={telHref(m.phoneE164)}>
                    {formatPhoneNl(m.phoneE164)}
                  </ContactLink>
                ) : (
                  S.common.notFilled
                ),
              },
              {
                term: S.applications.detail.email,
                value: m.email ? (
                  <ContactLink entityType="contact_message" entityId={m.id} channel="email" href={mailtoHref(m.email, D.mailSubject)}>
                    {m.email}
                  </ContactLink>
                ) : (
                  S.common.notFilled
                ),
              },
              { term: S.messages.columns.received, value: formatDateTimeNl(m.createdAt) },
              { term: S.applications.detail.message, value: m.message ?? S.common.notFilled },
            ]}
          />
          <ContactActions
            entityType="contact_message"
            entityId={m.id}
            phoneE164={m.phoneE164}
            email={m.email}
            name={m.name}
            whatsappText={fill(D.whatsappText, { naam: m.name, beheerder: ctx.profile.displayName })}
            mailSubject={D.mailSubject}
            layout="inline"
          />
        </SectionCard>
        <SectionCard id="status" title={S.statusForm.label}>
          <MessageStatusButtons id={m.id} status={m.status} />
        </SectionCard>
        <SectionCard id="tijdlijn" title={S.applications.detail.timeline}>
          <ActivityFeed items={m.timeline} emptyText={S.empty.timeline} />
        </SectionCard>
      </div>
    </>
  );
}
