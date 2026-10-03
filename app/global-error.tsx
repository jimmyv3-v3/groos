"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { contact } from "@/lib/site";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

// Fouten in de root-layout zelf. Er is dan geen next-intl-provider, dus de tekst
// staat hier inline (buiten de spiegelcontrole van npm run check, spec 01 §4.13).
const CONTENT = {
  nl: {
    title: "Er ging iets mis",
    body: `De site laadt nu niet goed. Probeer het opnieuw of bel ons op ${contact.phone}.`,
    retry: "Probeer opnieuw",
  },
  en: {
    title: "Something went wrong",
    body: `The site is not loading properly right now. Please try again or call us on ${contact.phone}.`,
    retry: "Try again",
  },
} as const;

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const pathname = usePathname() ?? "/";
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "nl";
  const c = CONTENT[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale} className={cn(fontSans.variable, fontDisplay.variable)}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <title>{c.title}</title>
        <main className="container max-w-2xl py-24">
          <h1 className="text-h1">{c.title}</h1>
          <p className="mt-6 text-lead text-muted-foreground">{c.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex h-12 items-center rounded-lg bg-primary px-5 font-medium text-primary-foreground hover:bg-brand-strong"
            >
              {c.retry}
            </button>
            <a
              href={contact.phoneHref}
              className="inline-flex h-12 items-center rounded-lg border border-border-strong px-5 font-medium text-foreground hover:border-brand hover:text-brand-strong"
            >
              {contact.phone}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
