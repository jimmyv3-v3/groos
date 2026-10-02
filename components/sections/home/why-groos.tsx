import type { LucideIcon } from "lucide-react";
import { Briefcase, Euro, MessageCircle, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { withConfirmedClaims, type ClaimKey } from "@/lib/claims";
import { RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
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
        <ul role="list" className="reveal-group mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {items.map(({ key, icon }) => (
            <RevealItem as="li" key={key} className="flex">
              <Card className="w-full">
                <IconTile icon={icon} />
                <CardTitle as="h3">{t(`items.${key}.title`)}</CardTitle>
                <CardDescription>{t(`items.${key}.body`)}</CardDescription>
              </Card>
            </RevealItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
