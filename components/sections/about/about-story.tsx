import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";

/**
 * Wat de naam Groos betekent (spec 04 §4.5.2). Het oprichtingsverhaal heeft
 * nog geen sleutel: zolang de claim foundingStory open staat, rendert deze
 * sectie daarvoor niets. Na bevestiging komt about.story.founding hier als
 * vierde alinea, achter isClaimConfirmed("foundingStory").
 */
export async function AboutStory() {
  const t = await getTranslations("about.story");
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <section id="verhaal" aria-labelledby="over-ons-verhaal-titel">
      <div className="container section lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <SectionHeading headingId="over-ons-verhaal-titel" title={t("title")} accent={t("accent")} />
        <Reveal className="mt-8 measure space-y-5 text-base lg:mt-0">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
