import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";

/** Kruimelpad, h1 en lead van /over-ons (spec 04 §4.5.1). Geen beweging. */
export async function AboutHero() {
  const [t, tNav] = await Promise.all([getTranslations("about.hero"), getTranslations("header.nav")]);

  return (
    <section aria-labelledby="over-ons-titel" className="pt-6 pb-10 md:pt-10 md:pb-14">
      <div className="container">
        <Breadcrumbs items={[{ label: tNav("overOns"), href: ROUTES.overOns }]} />
        <h1 id="over-ons-titel" className="mt-6 max-w-[22ch] text-h1 md:mt-8">
          {t.rich("title", { accent: (chunks) => <span className="accent-text">{chunks}</span> })}
        </h1>
        <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">{t("intro")}</p>
      </div>
    </section>
  );
}
