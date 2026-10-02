import { WTTA } from "@/lib/legal";
import { WttaStatus } from "@/components/legal/wtta-status";

/**
 * Wettelijke vermeldingen in de footer (spec 09 §4.5 en §4.6). De footer van
 * spec 01 toont zelf al naam, adres, e-mail, KvK en btw (contactblok) en de
 * juridische links (onderbalk); dit blok voegt de Wtta-status toe. Keurmerken
 * komen hier pas bij als ze bevestigd zijn (CL-01).
 */
export function FooterNotices() {
  if (WTTA.phase === "none") return null;
  return (
    <div className="mt-10 lg:mt-12">
      <WttaStatus variant="footer" />
    </div>
  );
}
