import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { isClaimConfirmed } from "@/lib/claims";
import { contact } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardTitle } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";

/**
 * Werkgebied en adres (spec 04 §4.5.4). De plaatsnamen staan achter de claim
 * workArea; het adres komt uit lib/site.ts, nooit uit messages. Geen kaart.
 */
export async function AboutArea() {
  const [t, tCommon] = await Promise.all([getTranslations("about.area"), getTranslations("common")]);
  const paragraphs = t.raw("paragraphs") as string[];
  const places = isClaimConfirmed("workArea") ? (t.raw("places") as string[]) : [];

  return (
    <section id="werkgebied" aria-labelledby="over-ons-werkgebied-titel">
      <div className="container section lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <div>
          <SectionHeading headingId="over-ons-werkgebied-titel" title={t("title")} accent={t("accent")} />
          <div className="mt-8 measure space-y-5 text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {places.length > 0 && (
              <>
                <p>{t("placesIntro")}</p>
                <ul role="list" className="flex flex-wrap gap-2">
                  {places.map((place) => (
                    <li key={place} className="rounded-full border border-border px-3 py-1 text-sm">
                      {place}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <Reveal className="mt-10 lg:mt-0">
          <Card>
            <div className="flex items-center gap-3">
              <IconTile icon={MapPin} />
              <CardTitle as="h3">{tCommon("contact.address")}</CardTitle>
            </div>
            <address className="text-base not-italic">
              {contact.name}
              <br />
              {contact.street}
              <br />
              {contact.postalCode} {contact.city}
              <span className="mt-3 block text-sm text-muted-foreground">{tCommon("address.byAppointment")}</span>
            </address>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
