import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "@/components/sections/breadcrumbs";
import { CtaLinks } from "./cta-links";
import type { CtaLink, HeroFact } from "./types";

/**
 * Hero van de beroeps- en overzichtspagina's (spec 05 §4.4.1): kruimelpad, h1,
 * lead van twee zinnen, feitenchips, knoppen en een notitie eronder. Geen beeld
 * zolang er geen foto's zijn (B-25). Server component; geen animatie boven de vouw.
 */
export function ServiceHero({
  breadcrumb,
  title,
  lead,
  facts,
  factsLabel,
  ctas,
  note,
  image,
}: {
  breadcrumb: Crumb[];
  title: string;
  lead: string;
  facts?: HeroFact[];
  factsLabel?: string;
  ctas: CtaLink[];
  note?: string;
  image?: { src: StaticImageData | string; alt: string };
}) {
  return (
    <section className="pt-6 pb-14 sm:pt-8 sm:pb-20">
      <div className="container">
        <Breadcrumbs items={breadcrumb} />

        <div className={cn("mt-8 grid items-center gap-12 sm:mt-12", image && "lg:grid-cols-2")}>
          <div className="max-w-3xl">
            <h1 className="text-h1">{title}</h1>
            <p className="mt-5 max-w-[60ch] text-lead text-muted-foreground">{lead}</p>

            {/* Telefoon: één blok met een regel per feit, want een lange waarde
                loopt in een ronde chip over drie regels. Vanaf sm losse chips. */}
            {facts && facts.length > 0 && (
              <ul
                aria-label={factsLabel}
                className="mt-6 grid divide-y divide-border rounded-xl border border-border bg-ice sm:mt-7 sm:flex sm:flex-wrap sm:gap-2 sm:divide-y-0 sm:rounded-none sm:border-0 sm:bg-transparent"
              >
                {facts.map((fact) => (
                  <li
                    key={fact.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 px-4 py-2.5 text-sm sm:inline-flex sm:justify-start sm:gap-x-1.5 sm:rounded-full sm:border sm:border-border sm:bg-ice sm:py-2"
                  >
                    <span className="text-muted-foreground">{fact.label}</span>{" "}
                    <strong className="font-semibold text-foreground tabular-nums">{fact.value}</strong>
                  </li>
                ))}
              </ul>
            )}

            <CtaLinks ctas={ctas} className="mt-6 sm:mt-8" />
            {note && <p className="mt-4 text-sm text-muted-foreground">{note}</p>}
          </div>

          {image && (
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
