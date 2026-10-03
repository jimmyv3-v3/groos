"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { S } from "@/app/beheer/_strings";
import { ctaButtonVariants } from "@/components/ui/cta-button";

/** Terugknop op mobiel voor detailpagina's: één niveau omhoog, alleen onder /beheer/<lijst>/<item>. */
export function BackButton({ href }: { href?: string }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const target = href ?? (parts.length >= 3 && parts[1] !== "meer" ? `/${parts.slice(0, parts.length - 1).join("/")}` : null);
  if (!target) return null;
  return (
    <Link href={target} aria-label={S.app.back} className={ctaButtonVariants({ variant: "ghost", size: "icon", className: "-ml-2 lg:hidden" })}>
      <ChevronLeft aria-hidden="true" />
    </Link>
  );
}
