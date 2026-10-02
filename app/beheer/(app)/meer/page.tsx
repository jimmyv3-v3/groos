import type { Metadata } from "next";
import { MoreList } from "@/components/beheer/more-list";
import { PageHeader } from "@/components/beheer/page-header";
import { getNavCounts } from "../../_data/nav";
import { requireAdmin } from "../../_lib/auth";
import { S } from "../../_strings";

export const metadata: Metadata = { title: S.more.metaTitle };

/** Menu voor de telefoon (spec 08 §4.4). */
export default async function MorePage() {
  const ctx = await requireAdmin();
  const counts = await getNavCounts(ctx);
  return (
    <>
      <PageHeader title={S.more.title} />
      <MoreList messagesNew={counts.messagesNew} requestsNew={counts.requestsNew} />
    </>
  );
}
