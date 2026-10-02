import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Paginering met echte links (?pagina=n, B-16). Onder 640 px alleen vorige,
 * de status ("Pagina 2 van 5") en volgende.
 */
function Pagination({ label, className, ...props }: { label: string } & React.ComponentProps<"nav">) {
  return (
    <nav aria-label={label} data-slot="pagination" className={cn("flex w-full justify-center", className)} {...props} />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex items-center gap-1", className)} {...props} />;
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" className={cn("hidden sm:block", className)} {...props} />;
}

function PaginationLink({
  href,
  isActive,
  children,
  className,
}: {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      className={cn(
        "inline-grid size-11 place-items-center rounded-lg text-sm font-medium tabular-nums text-foreground transition-colors hover:bg-muted",
        isActive && "border border-brand/30 bg-brand-tint text-brand-strong hover:bg-brand-tint",
        className,
      )}
    >
      {children}
    </Link>
  );
}

const stepClasses =
  "inline-flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted [&_svg]:size-4";

function PaginationPrevious({ href, label }: { href?: string; label: string }) {
  const inner = (
    <>
      <ChevronLeft aria-hidden="true" />
      <span>{label}</span>
    </>
  );
  return (
    <li data-slot="pagination-item">
      {href ? (
        <Link href={href} rel="prev" data-slot="pagination-link" className={stepClasses}>
          {inner}
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(stepClasses, "pointer-events-none opacity-50")}>
          {inner}
        </span>
      )}
    </li>
  );
}

function PaginationNext({ href, label }: { href?: string; label: string }) {
  const inner = (
    <>
      <span>{label}</span>
      <ChevronRight aria-hidden="true" />
    </>
  );
  return (
    <li data-slot="pagination-item">
      {href ? (
        <Link href={href} rel="next" data-slot="pagination-link" className={stepClasses}>
          {inner}
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(stepClasses, "pointer-events-none opacity-50")}>
          {inner}
        </span>
      )}
    </li>
  );
}

function PaginationEllipsis({ label }: { label: string }) {
  return (
    <li data-slot="pagination-item" className="hidden sm:block">
      <span className="inline-grid size-11 place-items-center text-muted-foreground">
        <span aria-hidden="true">…</span>
        <span className="sr-only">{label}</span>
      </span>
    </li>
  );
}

function PaginationStatus({ children }: { children: React.ReactNode }) {
  return (
    <li data-slot="pagination-status" className="px-2 text-sm tabular-nums text-muted-foreground sm:hidden">
      {children}
    </li>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationStatus,
};
