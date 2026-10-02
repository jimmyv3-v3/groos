import { Badge } from "@/components/ui/badge";
import { STATUS_TONE } from "@/app/beheer/_lib/status";
import { S } from "@/app/beheer/_strings";

type Kind = "vacancy" | "application" | "staffRequest" | "message";

/** Statusbadge met stip en tekst (spec 08 §4.2); kleur is nooit de enige drager. */
export function StatusBadge({ kind, status, size = "sm" }: { kind: Kind; status: string; size?: "sm" | "md" }) {
  const labels = S.status[kind] as Record<string, string>;
  const tones = STATUS_TONE[kind] as Record<string, (typeof STATUS_TONE)["vacancy"]["draft"]>;
  return (
    <Badge tone={tones[status] ?? "neutral"} size={size} dot>
      {labels[status] ?? status}
    </Badge>
  );
}
