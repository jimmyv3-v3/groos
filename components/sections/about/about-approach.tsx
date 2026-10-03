import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, MessagesSquare, Phone, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";

/** Alleen structuur; tekst in about.approach.items.<key>. */
const APPROACH_ITEMS = [
  { key: "kennismaken", icon: MessagesSquare },
  { key: "afspraken", icon: ClipboardCheck },
  { key: "contact", icon: Phone },
  { key: "kosten", icon: ShieldCheck },
] as const satisfies readonly { key: string; icon: LucideIcon }[];

/** De vier vaste gewoontes van Groos (spec 04 §4.5.5). */
export async function AboutApproach() {
  const t = await getTranslations("about.approach");

  return (
    <section id="werkwijze" aria-labelledby="over-ons-werkwijze-titel" className="bg-ice">
      <div className="container section">
        <SectionHeading headingId="over-ons-werkwijze-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
        <ul role="list" className="reveal-group mt-10 grid gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-4">
          {APPROACH_ITEMS.map(({ key, icon }) => (
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
