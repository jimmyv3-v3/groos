"use client";

import { useTransition, type MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Onthoud de keuze, zodat proxy.ts de bezoeker bij een volgend bezoek de juiste taal geeft. */
function rememberLocale(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

/**
 * Taalknop (gedrag spec 01 §4.7, uiterlijk spec 02). Twee echte links, dus
 * zonder JavaScript werkt hij ook. Met JavaScript onthoudt hij de keuze in
 * NEXT_LOCALE (proxy.ts leest die) en houdt hij de query (filters) vast.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common.languageSwitcher");
  const [isPending, startTransition] = useTransition();

  // Eentalige site: geen taalknop tonen.
  if (routing.locales.length < 2) return null;

  function switchTo(event: MouseEvent<HTMLAnchorElement>, next: Locale) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    rememberLocale(next);
    if (next === locale) return;
    // Lees de query hier en niet met useSearchParams: dat zou statische pagina's
    // dwingen tot clientrendering.
    startTransition(() => {
      router.replace(`${pathname}${window.location.search}`, { locale: next });
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground lg:h-10",
        isPending && "opacity-60",
        className,
      )}
    >
      <Languages className="size-4 shrink-0 text-brand" aria-hidden />
      {routing.locales.map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && (
            <span className="px-0.5 text-border-strong" aria-hidden>
              /
            </span>
          )}
          <Link
            href={pathname}
            locale={code}
            hrefLang={code}
            lang={code}
            aria-label={t(code)}
            aria-current={code === locale ? "true" : undefined}
            onClick={(event) => switchTo(event, code)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-sm px-1 uppercase transition-colors duration-150 ease-brand lg:min-h-10",
              code === locale
                ? "text-foreground underline decoration-brand decoration-2 underline-offset-[6px]"
                : "text-muted-foreground hover:text-brand-strong",
            )}
          >
            {code}
          </Link>
        </span>
      ))}
    </div>
  );
}
