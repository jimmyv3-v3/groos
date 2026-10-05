import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function Breadcrumb({ label, ...props }: { label: string } & React.ComponentProps<"nav">) {
  return <nav aria-label={label} data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

/**
 * Onder lg is het raakvlak van een kruimel 44 px hoog en iets breder dan de
 * tekst. De negatieve marge (de helft van 44 px min de regelhoogte van
 * text-sm) houdt de regel even hoog als de tekst: het vlak steekt boven en
 * onder uit, de opmaak verschuift niet.
 */
function BreadcrumbLink({
  href,
  className,
  ...props
}: { href: string } & Omit<React.ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href={href}
      data-slot="breadcrumb-link"
      className={cn(
        "-mx-1.5 inline-flex items-center px-1.5 underline-offset-4 transition-colors hover:text-brand-strong hover:underline max-lg:-my-[0.671875rem] max-lg:min-h-11",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("line-clamp-1 font-medium text-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn("text-brand-subtle [&>svg]:size-3.5", className)}
      {...props}
    >
      <ChevronRight aria-hidden="true" />
    </li>
  );
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator };
