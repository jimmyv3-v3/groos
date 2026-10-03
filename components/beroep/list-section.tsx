import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";

/**
 * Sectie met één of meer lijsten naast elkaar (spec 05 §4.4.2): taken,
 * werkplekken, eisen, rechten en zekerheden. Een groep met titel krijgt een h3.
 */
export function ListSection({
  id,
  heading,
  accent,
  intro,
  groups,
  note,
  tone = "dot",
  link,
  className,
}: {
  id?: string;
  heading: string;
  accent?: string;
  intro?: string;
  groups: { title?: string; items: string[] }[];
  note?: string;
  tone?: "check" | "dot";
  link?: { label: string; href: AppPath };
  className?: string;
}) {
  const single = groups.length === 1;
  return (
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <Reveal
          className={cn(
            "mt-10 grid gap-10 md:mt-12",
            single ? "max-w-3xl" : "md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-14",
          )}
        >
          {groups.map((group, gi) => (
            <div key={group.title ?? gi}>
              {group.title && <h3 className="mb-4 text-h3">{group.title}</h3>}
              <ul className="grid gap-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-base">
                    {tone === "check" ? (
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                        <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
        {note && <p className="mt-8 max-w-3xl text-base text-muted-foreground">{note}</p>}
        {link && (
          <p className="mt-6">
            <Link href={link.href} className="link inline-flex min-h-11 items-center gap-2 font-medium">
              {link.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
