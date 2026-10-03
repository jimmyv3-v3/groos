import { Languages, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { contact } from "@/lib/site";
import { Alert } from "@/components/ui/alert";

/** Melding op /en dat de vacaturetekst alleen Nederlands is (spec 06 §4.10, B-03). */
export async function OnlyDutchNotice({ locale }: { locale: Locale }) {
  if (locale === "nl") return null;
  const [t, tc] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.detail" }),
    getTranslations({ locale, namespace: "common.cta" }),
  ]);
  return (
    <Alert tone="info" icon={Languages} role="note">
      <p>{t("onlyDutch")}</p>
      <a
        href={contact.phoneHref}
        className="mt-1 inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4"
      >
        <Phone className="size-4" aria-hidden="true" />
        {tc("call")} {contact.phone}
      </a>
    </Alert>
  );
}
