// STUB: wordt vervangen door spec 07
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";

type ApplySectionProps = { vacancy: VacancyDetail; locale: Locale };

/**
 * Tijdelijke plek van het sollicitatieblok (spec 06 §4.10, spec 07 §4.4).
 * Spec 07 levert section#solliciteren met kop, ApplyForm en ContactAside;
 * tot dan werkt het anker en vindt npm run check de TODO.
 */
export function ApplySection({ vacancy }: ApplySectionProps) {
  return (
    <section id="solliciteren" data-vacancy={vacancy.number} className="scroll-mt-24 rounded-2xl border border-dashed border-border-strong p-6">
      <p className="text-muted-foreground">TODO formulier uit spec 07</p>
    </section>
  );
}
