"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { S } from "@/app/beheer/_strings";

/** Leest ?melding=<sleutel uit S.toasts>, toont de toast en haalt de parameter weg (spec 08 §4.3). */
export function FlashToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const shown = useRef<string | null>(null);
  const key = params.get("melding");

  useEffect(() => {
    if (!key || shown.current === key) return;
    const toasts = S.toasts as Record<string, string>;
    const title = Object.hasOwn(toasts, key) ? toasts[key] : null;
    shown.current = key;
    if (title) toast.add({ title, type: "success" });
    const next = new URLSearchParams(params.toString());
    next.delete("melding");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [key, params, pathname, router, toast]);

  return null;
}
