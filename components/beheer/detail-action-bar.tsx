"use client";

import type { ReactNode } from "react";

/** Vaste actiebalk onderin onder lg (spec 08 §4.3); verbergt de tabbalk via data-actiebalk. */
export function DetailActionBar({ children }: { children: ReactNode }) {
  return (
    <div
      data-actiebalk
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="mx-auto grid h-16 max-w-xl grid-cols-4 items-stretch">{children}</div>
    </div>
  );
}
