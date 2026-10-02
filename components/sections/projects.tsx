import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { projectPhotos } from "@/lib/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

/**
 * Projectengalerij: een uniform raster van even grote fototegels, zonder tekst
 * in de blokken. Foto's en alt-sleutels staan in lib/site.ts (`projectPhotos`);
 * tegels zonder foto tonen een placeholder.
 */
export function Projects() {
  const t = useTranslations("home.projects");
  return (
    <section id="projecten" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container relative">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl">
            {t("titleLead")}{" "}
            <span className="accent-text font-normal">{t("titleAccent")}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>
        </Reveal>

        <RevealGroup
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          stagger={0.05}
          delayChildren={0.1}
        >
          {projectPhotos.map((photo, i) => (
            <RevealItem key={photo.src ?? `placeholder-${i}`}>
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border/70 bg-card/40">
                {photo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.src}
                    alt={t(photo.altKey)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(160deg,hsl(var(--muted)),hsl(var(--card)))]">
                    <ImageIcon className="h-6 w-6 text-brand-subtle" aria-hidden />
                    <span className="sr-only">{t(photo.altKey)}</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-brand/40" />
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
