import type { Metadata } from "next";
import Link from "next/link";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { TopBar } from "@/components/beheer/top-bar";
import { beheerPaths } from "./_lib/paths";
import { S } from "./_strings";

export const metadata: Metadata = { title: S.notFound.metaTitle };

/** 404 binnen de beheerlayout (spec 08 §4.11), ook voor het vangnet [...rest]. */
export default function BeheerNotFound() {
  return (
    <>
      <TopBar />
      <main id="inhoud" tabIndex={-1} className="mx-auto grid max-w-2xl gap-4 px-4 py-16 focus:outline-none">
        <h1 className="text-[1.75rem] leading-tight lg:text-[2.125rem]">{S.notFound.title}</h1>
        <p className="text-base text-muted-foreground">{S.notFound.body}</p>
        <div>
          <Link href={beheerPaths.home} className={ctaButtonVariants()}>
            {S.notFound.home}
          </Link>
        </div>
      </main>
    </>
  );
}
