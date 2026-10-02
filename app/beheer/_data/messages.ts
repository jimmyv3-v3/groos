import "server-only";
import type { ContactTopic, MessageStatus } from "@/lib/data/options";
import type { AdminContext } from "../_lib/auth";
import { searchTerms } from "../_lib/search";
import { countTabs, MESSAGE_TABS } from "../_lib/status";
import type { ActivityItem, MessageTab } from "../_lib/types";
import { listActivities } from "./activities";
import { PAGE_SIZE } from "./vacancies";

export type MessageListRow = {
  id: string;
  name: string;
  topic: ContactTopic;
  phoneE164: string | null;
  email: string | null;
  createdAt: string;
  status: MessageStatus;
};

export type MessageDetail = MessageListRow & { message: string | null; timeline: ActivityItem[] };

const LIST_SELECT = "id, name, topic, phone_e164, email, created_at, status";

export async function listMessages(
  ctx: AdminContext,
  p: { tab: MessageTab; q?: string; onderwerp?: ContactTopic; page: number },
): Promise<{ rows: MessageListRow[]; total: number; pageCount: number; tabCounts: Record<MessageTab, number> }> {
  let query = ctx.supabase
    .from("contact_messages")
    .select(LIST_SELECT, { count: "exact" })
    .in("status", [...MESSAGE_TABS[p.tab]]);
  for (const term of searchTerms(p.q)) {
    if (term.kind === "phone") query = query.ilike("phone_e164", `%${term.value}%`);
    else query = query.or(`name.ilike.%${term.value}%,email.ilike.%${term.value}%`);
  }
  if (p.onderwerp) query = query.eq("topic", p.onderwerp);

  const from = (p.page - 1) * PAGE_SIZE;
  const [list, statuses] = await Promise.all([
    query.order("created_at", { ascending: false }).range(from, from + PAGE_SIZE - 1),
    ctx.supabase.from("contact_messages").select("status"),
  ]);
  if (list.error) throw list.error;
  if (statuses.error) throw statuses.error;
  const rows: MessageListRow[] = (list.data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    topic: m.topic,
    phoneE164: m.phone_e164,
    email: m.email,
    createdAt: m.created_at,
    status: m.status,
  }));
  const total = list.count ?? rows.length;
  return {
    rows,
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    tabCounts: countTabs((statuses.data ?? []).map((s) => s.status), MESSAGE_TABS),
  };
}

export async function getMessage(ctx: AdminContext, id: string): Promise<MessageDetail | null> {
  const { data, error } = await ctx.supabase
    .from("contact_messages")
    .select(`${LIST_SELECT}, message`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const timeline = await listActivities(ctx, "contact_message", data.id);
  return {
    id: data.id,
    name: data.name,
    topic: data.topic,
    phoneE164: data.phone_e164,
    email: data.email,
    createdAt: data.created_at,
    status: data.status,
    message: data.message,
    timeline,
  };
}
