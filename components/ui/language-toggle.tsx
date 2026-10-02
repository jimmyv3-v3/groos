"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const ONE_YEAR = 60 * 60 * 24 * 365;

// Onthoud de keuze zodat proxy.ts de bezoeker bij een volgend bezoek meteen de
// juiste taal toont.
function rememberLocale(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${ONE_YEAR};samesite=lax`;
}

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common.languageSwitcher");
  const [isPending, startTransition] = useTransition();

  // Eentalige site: geen taalknop tonen.
  if (routing.locales.length < 2) return null;

  function switchTo(next: Locale) {
    if (next === locale) return;
    rememberLocale(next);
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        isPending && "opacity-60",
        className,
      )}
    >
      {routing.locales.map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && <span className="px-1 text-border" aria-hidden>/</span>}
          <button
            type="button"
            onClick={() => switchTo(code)}
            aria-current={code === locale ? "true" : undefined}
            className={cn(
              "uppercase tracking-wide transition-colors",
              code === locale
                ? "text-brand-strong"
                : "text-muted-foreground hover:text-brand-strong",
            )}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
