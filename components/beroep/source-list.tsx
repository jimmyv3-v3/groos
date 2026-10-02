import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";

/** Officiële bronnen met peildatum (spec 05 §4.4.2); externe links in hetzelfde tabblad (spec 09 §8). */
export function SourceList({
  id,
  heading,
  intro,
  items,
  className,
}: {
  id?: string;
  heading: string;
  intro: string;
  items: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} intro={intro} />
        <ul className="mt-8 grid max-w-3xl gap-2">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="link inline-flex min-h-11 items-center gap-2">
                {item.label}
                <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
