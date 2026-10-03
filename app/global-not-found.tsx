import type { Metadata } from "next";
import Link from "next/link";
import { contact } from "@/lib/site";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

// 404 voor URL's zonder route buiten de taalproxy, zoals /beheer/bestaat-niet of
// /bestand.xyz (spec 01 §4.13). Tekst inline, buiten de spiegelcontrole.
export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="nl" className={cn(fontSans.variable, fontDisplay.variable)}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <main className="container max-w-2xl py-24">
          <h1 className="text-h1">Deze pagina bestaat niet</h1>
          <p className="mt-6 text-lead text-muted-foreground">
            Ga naar de homepage of bel ons op {contact.phone}.
          </p>
          <p lang="en" className="mt-2 text-muted-foreground">
            This page does not exist.
          </p>
          <p className="mt-8 flex gap-6 text-sm font-medium">
            <Link href="/" className="text-brand underline-offset-4 hover:underline">
              Naar de homepage
            </Link>
            <Link href="/en" lang="en" className="text-brand underline-offset-4 hover:underline">
              English homepage
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
