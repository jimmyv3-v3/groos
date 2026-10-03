import { Breadcrumbs, type Crumb } from "@/components/sections/breadcrumbs";

/**
 * Skelet voor routes waarvan de inhoud in een latere bouwstap komt (spec 01
 * §4.20). Verdwijnt zodra geen pagina het meer importeert (spec 14 controleert dat).
 */
export function PagePlaceholder({ title, breadcrumbs, spec }: { title: string; breadcrumbs?: Crumb[]; spec: string }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="container max-w-3xl">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="mb-8" />}
        <h1 className="text-h1">{title}</h1>
        <p className="mt-6 text-lead text-muted-foreground">TODO inhoud volgt uit spec {spec}.</p>
      </div>
    </section>
  );
}
