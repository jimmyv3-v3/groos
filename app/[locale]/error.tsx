"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Phone, RotateCw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { contact } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * Foutgrens van de publieke pagina's (spec 01 §4.13). Header en footer blijven
 * staan; de bezoeker kan opnieuw proberen of bellen.
 */
export default function LocaleError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-16 sm:py-24">
      <title>{t("metaTitle")}</title>
      <div className="container max-w-2xl">
        <h1 className="text-h1">{t("title")}</h1>
        <p className="mt-6 text-lead text-muted-foreground">{t("body", { phone: contact.phone })}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CtaButton onClick={() => retry()}>
            <RotateCw aria-hidden />
            {t("retry")}
          </CtaButton>
          <CtaButton href={contact.phoneHref} variant="secondary">
            <Phone className="text-brand" aria-hidden />
            {contact.phone}
          </CtaButton>
        </div>
        <p className="mt-8">
          <Link href="/" className="text-sm font-medium text-brand underline-offset-4 hover:underline">
            {t("home")}
          </Link>
        </p>
        {error.digest && <p className="mt-6 text-xs text-muted-foreground">{t("code", { digest: error.digest })}</p>}
      </div>
    </section>
  );
}
