import type { LucideIcon } from "lucide-react";
import { Briefcase, Euro, MessageCircle, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { withConfirmedClaims, type ClaimKey } from "@/lib/claims";
import { RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";

/**
 * Alleen structuur; tekst in home.why.items.<key>. Een item met claim verschijnt
 * pas na bevestiging (spec 03). Na B-24 komt hier { key: "keurmerk", icon:
 * ShieldCheck, claim: "keurmerk" } bij, met registerlink (spec 04 §4.3.5).
 */
const WHY_ITEMS = [
  { key: "contactpersonen", icon: Users },
  { key: "beroepen", icon: Briefcase },
  { key: "loon", icon: Euro },
  { key: "solliciteren", icon: MessageCircle },
] as const satisfies readonly { key: string; icon: LucideIcon; claim?: ClaimKey }[];

/** Vaste afspraken van Groos, alleen met claims uit categorie A en B (spec 04 §4.3.5). */
export async function WhyGroos() {
  const t = await getTranslations("home.why");
  const items = withConfirmedClaims<{ key: (typeof WHY_ITEMS)[number]["key"]; icon: LucideIcon; claim?: ClaimKey }>(
    WHY_ITEMS,
  );

  return (
    <section id="waarom-groos" aria-labelledby="home-waarom-titel">
      <div className="container section">
        <SectionHeading headingId="home-waarom-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
        {/* Eén paneel met haarlijnen tussen de cellen; de buitenste lijnen vallen
            buiten het afgeronde kader. */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
          <ul role="list" className="reveal-group -mr-px -mb-px grid md:grid-cols-2 lg:grid-cols-4">
            {items.map(({ key, icon }) => (
              <RevealItem as="li" key={key} className="flex flex-col gap-4 border-r border-b border-border p-6 md:p-7">
                <IconTile icon={icon} />
                <div className="grid gap-2">
                  <CardTitle as="h3">{t(`items.${key}.title`)}</CardTitle>
                  <CardDescription>{t(`items.${key}.body`)}</CardDescription>
                </div>
              </RevealItem>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
