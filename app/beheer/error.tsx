"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { CtaButton, ctaButtonVariants } from "@/components/ui/cta-button";
import { beheerPaths } from "./_lib/paths";
import { S, fill } from "./_strings";

/** Foutgrens van het beheer (spec 08 §4.11). */
export default function BeheerError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="inhoud" tabIndex={-1} className="mx-auto grid max-w-2xl gap-4 px-4 py-16 focus:outline-none">
      <title>{`${S.error.metaTitle} · ${S.app.name}`}</title>
      <h1 className="text-[1.75rem] leading-tight lg:text-[2.125rem]">{S.error.title}</h1>
      <p className="text-base text-muted-foreground">{S.error.body}</p>
      <div className="flex flex-wrap gap-3">
        <CtaButton onClick={() => retry()}>
          <RotateCw aria-hidden="true" />
          {S.error.retry}
        </CtaButton>
        <Link href={beheerPaths.home} className={ctaButtonVariants({ variant: "secondary" })}>
          {S.error.home}
        </Link>
      </div>
      {error.digest && <p className="text-xs text-muted-foreground">{fill(S.error.code, { code: error.digest })}</p>}
    </main>
  );
}
