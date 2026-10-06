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
        <aside className="flex flex-col gap-1 border-l-2 border-brand pl-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="max-w-[60ch] text-base text-foreground">{text}</p>
          {/* Inline, zodat de pijl bij het laatste woord blijft als de link over twee regels loopt. */}
          <Link href={href} className="link inline-block py-2.5 font-medium md:shrink-0">
            {linkLabel}
            {"\u00A0"}
            <ArrowRight className="inline size-4 align-[-0.125em]" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
