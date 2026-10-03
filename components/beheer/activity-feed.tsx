import Link from "next/link";
import {
  ArrowRightLeft,
  Clock,
  FileText,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  StickyNote,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { formatRelativeNl } from "@/app/beheer/_lib/format";
import type { ActivityItem, ActivityKind } from "@/app/beheer/_lib/types";
import { S, fill } from "@/app/beheer/_strings";

const ICONS: Record<ActivityKind, LucideIcon> = {
  note: StickyNote,
  status_change: ArrowRightLeft,
  call: Phone,
  whatsapp: MessageCircle,
  email_sent: Mail,
  cv_viewed: FileText,
  assigned: UserCheck,
  consent_recorded: ShieldCheck,
  auto_closed: Clock,
};

/** Statuslabel over alle soorten heen; "closed" met reden wordt Vervuld, Ingetrokken of Gesloten. */
function statusLabel(to: unknown, reason: unknown): string {
  const value = String(to ?? "");
  if (value === "closed") {
    if (reason === "filled") return S.status.vacancy.filled;
    if (reason === "withdrawn") return S.status.vacancy.withdrawn;
    if (reason === "expired") return S.status.vacancy.expired;
    return S.status.vacancy.closed_other;
  }
  const maps = [S.status.vacancy, S.status.application, S.status.staffRequest, S.status.message] as Record<string, string>[];
  for (const map of maps) if (map[value]) return map[value];
  return value;
}

export function activityText(item: ActivityItem): string {
  if (item.kind === "auto_closed") return S.activity.auto_closed;
  const naam = item.actorName ?? S.activity.system;
  const p = item.payload ?? {};
  switch (item.kind) {
    case "status_change":
      return fill(S.activity.status_change, { naam, status: statusLabel(p.to, p.reason) });
    case "assigned":
      return fill(S.activity.assigned, {
        naam,
        toegewezen: typeof p.toName === "string" ? p.toName : S.common.nobody,
      });
    default:
      return fill(S.activity[item.kind], { naam });
  }
}

/**
 * Tijdlijn als <ol> met <time> (spec 08 §4.3). Opbouw naar 21st.dev 29394
 * (felipemenezes098, Activity Feed): icoontegel, titel, toelichting en tijd.
 */
export function ActivityFeed({
  items,
  showEntity = false,
  emptyText,
}: {
  items: ActivityItem[];
  showEntity?: boolean;
  emptyText: string;
}) {
  if (items.length === 0) return <p className="text-base text-muted-foreground">{emptyText}</p>;
  const now = new Date();
  return (
    <ol className="divide-y divide-border">
      {items.map((item) => {
        const Icon = ICONS[item.kind];
        return (
          <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <span className="mt-0.5 inline-grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-muted text-muted-foreground">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="grid min-w-0 flex-1 gap-0.5">
              <p className="text-base font-medium text-foreground">
                {activityText(item)}
                {showEntity && item.entity && (
                  <>
                    {" "}
                    <span className="font-normal text-muted-foreground">
                      {fill(S.activity.about, { onderdeel: "" }).trim()}{" "}
                    </span>
                    <Link href={item.entity.href} className="link font-normal">
                      {item.entity.label}
                    </Link>
                  </>
                )}
              </p>
              {item.body && <p className="text-base whitespace-pre-line break-words text-foreground">{item.body}</p>}
              <time dateTime={item.createdAt} className="text-sm text-muted-foreground">
                {formatRelativeNl(item.createdAt, now)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
