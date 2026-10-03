import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BadgeTone, TodoItem } from "@/app/beheer/_lib/types";
import { S, fill } from "@/app/beheer/_strings";
import { cn } from "@/lib/utils";
import { ExtendButton } from "./extend-button";

const DOT: Record<BadgeTone, string> = {
  neutral: "bg-border-strong",
  brand: "bg-brand",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
};

/** Gegroepeerde takenlijst; elke regel is een link, geen afvinkitem (spec 08 §4.6). */
export function TodoList({
  groups,
}: {
  groups: { key: string; title: string; items: TodoItem[]; total?: number; allHref?: string }[];
}) {
  return (
    <div className="grid gap-6">
      {groups.map((group) => (
        <div key={group.key} className="grid gap-2">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            {group.title}
            <span className="rounded-full bg-muted px-2 text-xs font-medium tabular-nums text-muted-foreground">
              {group.total ?? group.items.length}
            </span>
          </h3>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {group.items.map((item) => (
              <li key={item.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
                <Link href={item.href} className="group flex min-h-11 flex-1 items-start gap-3 rounded-md">
                  <span aria-hidden="true" className={cn("mt-2 size-2 shrink-0 rounded-full", DOT[item.tone ?? "neutral"])} />
                  <span className="flex-1 text-base text-foreground group-hover:text-brand-strong group-hover:underline">
                    {item.text}
                  </span>
                  <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
                {item.extendId && <ExtendButton id={item.extendId} />}
              </li>
            ))}
          </ul>
          {group.allHref && (group.total ?? 0) > group.items.length && (
            <Link href={group.allHref} className="link inline-flex min-h-11 items-center text-sm">
              {fill(S.common.viewAll, { aantal: group.total ?? 0 })}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
