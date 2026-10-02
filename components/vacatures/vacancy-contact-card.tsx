import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { VacancyDetail } from "@/lib/data/types";
import { whatsappLink } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";
import { asPhone, type ResolvedVacancyContact } from "./vacancy-format";

type Props = { vacancy: VacancyDetail; locale: Locale; contact: ResolvedVacancyContact };

/** Contactpersoon: een echt gezicht en een echt nummer (spec 06 §4.10). */
export async function VacancyContactCard({ vacancy, locale, contact }: Props) {
  const [t, tc, tw, ta, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.detail" }),
    getTranslations({ locale, namespace: "common.cta" }),
    getTranslations({ locale, namespace: "common.whatsapp" }),
    getTranslations({ locale, namespace: "common.a11y" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  return (
    <section aria-labelledby="vacature-vragen">
      <h2 id="vacature-vragen" className="text-h3 sm:text-[1.5rem]">
        {t("sections.contact")}
      </h2>
      <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-border p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-4 sm:flex-1">
          {contact.photoUrl ? (
            <Image
              src={contact.photoUrl}
              alt={contact.name}
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-16 shrink-0 place-items-center rounded-full bg-brand-tint font-display text-2xl font-semibold text-brand-strong"
            >
              {contact.name.charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{contact.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("contact.body", { name: contact.name })}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:shrink-0">
          <CtaButton
            href={`tel:${contact.phoneE164}`}
            variant="secondary"
            ariaLabel={ta("callPerson", { name: contact.name, phone: contact.phoneDisplay })}
          >
            <Phone aria-hidden="true" />
            {tc("callPerson", { name: contact.name })}
          </CtaButton>
          {contact.whatsappE164 && (
            <CtaButton
              href={whatsappLink(
                tw("vacatureVraag", { title: vacancy.title, number: vacancy.number }),
                asPhone(contact.whatsappE164),
              )}
              variant="secondary"
              external
            >
              <MessageCircle aria-hidden="true" />
              {tc("whatsappPerson", { name: contact.name })}
              <span className="sr-only"> {tCommon("opensInNewTab")}</span>
            </CtaButton>
          )}
        </div>
      </div>
    </section>
  );
}
