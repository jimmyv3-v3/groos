import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, MessagesSquare, Phone, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { CardDescription, CardTitle } from "@/components/ui/card";
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
    <section id="werkwijze" aria-labelledby="over-ons-werkwijze-titel">
      <div className="container section">
        <SectionHeading headingId="over-ons-werkwijze-titel" title={t("title")} accent={t("accent")} intro={t("intro")} />
        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
          <ul role="list" className="reveal-group -mr-px -mb-px grid md:grid-cols-2 xl:grid-cols-4">
            {APPROACH_ITEMS.map(({ key, icon }) => (
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
