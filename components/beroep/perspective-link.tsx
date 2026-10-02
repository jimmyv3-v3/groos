import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Verwijzing naar het andere perspectief van hetzelfde beroep (spec 05 §4.4.2). */
export function PerspectiveLink({
  text,
  linkLabel,
  href,
  className,
}: {
  text: string;
  linkLabel: string;
  href: AppPath;
  className?: string;
}) {
  return (
    <div className={cn("section-tight", className)}>
      <div className="container">
        <aside className="flex flex-col gap-3 border-l-2 border-brand pl-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="max-w-[60ch] text-base text-foreground">{text}</p>
          <Link href={href} className="link inline-flex min-h-11 shrink-0 items-center gap-2 font-medium">
            {linkLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
