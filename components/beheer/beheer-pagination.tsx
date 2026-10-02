import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { S, fill } from "@/app/beheer/_strings";
import { cn } from "@/lib/utils";

const step =
  "inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted [&_svg]:size-4";

/** Paginering met next/link, in de vorm van Pagination van spec 02. */
export function BeheerPagination({
  page,
  pageCount,
  hrefFor,
  label,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  label: string;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label={label} className="mt-6 flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={step}>
          <ChevronLeft aria-hidden="true" />
          {S.common.previous}
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(step, "pointer-events-none opacity-50")}>
          <ChevronLeft aria-hidden="true" />
          {S.common.previous}
        </span>
      )}
      <span className="text-sm tabular-nums text-muted-foreground" aria-current="page">
        {fill(S.common.pageOf, { pagina: page, totaal: pageCount })}
      </span>
      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} rel="next" className={step}>
          {S.common.next}
          <ChevronRight aria-hidden="true" />
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(step, "pointer-events-none opacity-50")}>
          {S.common.next}
          <ChevronRight aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
