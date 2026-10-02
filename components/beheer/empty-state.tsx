import type { ReactNode } from "react";

/** Lege staat: rustige tekst in een kader, met een optionele actie. */
export function EmptyState({ title, body, action }: { title?: string; body: string; action?: ReactNode }) {
  return (
    <div className="grid justify-items-start gap-3 rounded-2xl border border-dashed border-border-strong bg-ice p-6 sm:justify-items-center sm:p-10 sm:text-center">
      {title && <p className="font-display text-h3 font-semibold">{title}</p>}
      <p className="max-w-prose text-base text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}
