import { UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ROUTES } from "@/lib/routes";
import { CtaButton } from "@/components/ui/cta-button";
import { IconTile } from "@/components/ui/icon-tile";

type Props = { locale: Locale; headingId: string };

/** Inschrijfoproep: rustig vlak met één knop (spec 06 §4.2 en §4.3). */
export async function VacancyRegisterPrompt({ locale, headingId }: Props) {
  const [t, tc] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.registerPrompt" }),
    getTranslations({ locale, namespace: "common.cta" }),
  ]);
  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-5 rounded-2xl bg-brand-tint p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
    >
      <div className="flex gap-4">
        <IconTile icon={UserPlus} tone="brand" className="hidden sm:inline-grid" />
        <div>
          <h2 id={headingId} className="text-h3">
            {t("title")}
          </h2>
          <p className="mt-2 max-w-prose text-foreground">{t("body")}</p>
        </div>
      </div>
      <CtaButton href={ROUTES.inschrijven} className="shrink-0 sm:self-center">
        {tc("register")}
      </CtaButton>
    </section>
  );
}
