import type { ReactNode } from "react";

/** Paginakop met de enige h1 van de pagina (spec 08 §4.3). */
export function PageHeader({
  title,
  description,
  actions,
  meta,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid min-w-0 gap-2">
        <h1 className="text-[1.75rem] leading-tight wrap-anywhere hyphens-auto lg:text-[2.125rem]">{title}</h1>
        {meta && <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">{meta}</div>}
        {description && <p className="text-base text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
