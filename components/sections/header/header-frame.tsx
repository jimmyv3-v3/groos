"use client";

import type { ReactNode } from "react";
import { useScroll } from "@/components/ui/use-scroll";
import { cn } from "@/lib/utils";

/**
 * De <header> zelf (spec 02 §4.13): sticky, wit, zonder blur of schaduw. De
 * rand onder wordt pas zichtbaar na 8 px scrollen. De inhoud rendert op de server.
 */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const scrolled = useScroll(8);
  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 border-b bg-background transition-colors duration-150 ease-brand motion-reduce:transition-none",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      {children}
    </header>
  );
}
