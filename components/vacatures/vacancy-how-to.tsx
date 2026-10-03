import { CalendarCheck, Phone, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { IconTile } from "@/components/ui/icon-tile";

const ICONS = [Send, Phone, CalendarCheck];

/**
 * "Zo solliciteer je" in drie stappen (spec 06 §4.10). Eigen compacte opmaak
 * binnen de tekstkolom in plaats van ServiceSteps (spec 05), omdat die een
 * eigen container en sectieruimte heeft; tekst en id zijn gelijk aan de spec.
 */
export async function VacancyHowTo({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "vacatures.detail" });
  const steps = t.raw("howTo.steps") as { title: string; body: string }[];
  return (
    <section id="zo-solliciteer-je" aria-labelledby="zo-solliciteer-je-titel" className="scroll-mt-24">
      <h2 id="zo-solliciteer-je-titel" className="text-h3 sm:text-[1.5rem]">
        {t("sections.howTo")}
      </h2>
      <ol role="list" className="mt-5 grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = ICONS[i] ?? Send;
          return (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-border p-5 sm:flex-col sm:gap-3">
              <IconTile icon={Icon} />
              <div>
                <h3 className="text-base font-semibold sm:text-h3">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
