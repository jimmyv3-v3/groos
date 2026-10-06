import type { ReactNode } from "react";

/** Blok met een h2 (spec 08 §4.3). */
export function SectionCard({
  id,
  title,
  description,
  actions,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const headingId = id ? `${id}-titel` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <h2 id={headingId} className="text-[1.25rem] leading-snug wrap-anywhere">
            {title}
          </h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
