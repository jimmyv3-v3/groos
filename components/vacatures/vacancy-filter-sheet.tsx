"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { CtaButton, ctaButtonVariants } from "@/components/ui/cta-button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { FilterGroup, HiddenField } from "./types";
import { VacancyFilters } from "./vacancy-filters";

type Props = {
  action: string;
  groups: FilterGroup[];
  hidden: HiddenField[];
  activeCount: number;
  showResultsLabel: string;
  clearHref: string;
  labels: {
    open: string;
    openWithCount: string;
    title: string;
    close: string;
    clearAll: string;
    heading: string;
    apply: string;
  };
};

/**
 * Filterpaneel onder lg (spec 06 §4.4): knop "Filters (n)" opent de Sheet van
 * spec 02 van rechts. De voetknop toont het aantal resultaten, dat mee ververst
 * met elke navigatie; focusval, Escape en scrollvergrendeling levert de Sheet.
 */
export function VacancyFilterSheet({ action, groups, hidden, activeCount, showResultsLabel, clearHref, labels }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={ctaButtonVariants({ variant: "secondary", size: "default", className: "lg:hidden" })}>
        <SlidersHorizontal aria-hidden="true" />
        {activeCount > 0 ? labels.openWithCount : labels.open}
      </SheetTrigger>
      <SheetContent side="right" closeLabel={labels.close}>
        <SheetHeader>
          <SheetTitle>{labels.title}</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          <VacancyFilters
            action={action}
            groups={groups}
            hidden={hidden}
            idPrefix="paneel"
            labels={{ heading: labels.heading, apply: labels.apply }}
          />
        </div>
        {/* flex-wrap: op een smalle telefoon passen de twee knoppen niet naast elkaar en komen ze onder elkaar. */}
        <SheetFooter className="flex-wrap pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {activeCount > 0 && (
            <CtaButton href={clearHref} variant="secondary" className="flex-1 px-3" onClick={() => setOpen(false)}>
              {labels.clearAll}
            </CtaButton>
          )}
          <CtaButton className="flex-1 px-3 tabular-nums" onClick={() => setOpen(false)}>
            {showResultsLabel}
          </CtaButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
