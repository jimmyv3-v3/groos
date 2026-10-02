"use client";

import { createContext, use, useCallback, useMemo, useTransition, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Navigatie van /vacatures met JavaScript (spec 06 §4.4): filters, zoeken en
 * sorteren verversen de lijst zonder volledige paginalading, met een
 * zichtbare en voorleesbare wachtstand.
 */
export type VacancyNavigation = {
  isPending: boolean;
  /** `onStart` loopt in dezelfde transitie, bijvoorbeeld voor useOptimistic. */
  navigate: (params: URLSearchParams, mode?: "replace" | "push", onStart?: () => void) => void;
};

const VacancyNavigationContext = createContext<VacancyNavigation | null>(null);

export function VacancyNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigate = useCallback<VacancyNavigation["navigate"]>(
    (params, mode = "replace", onStart) => {
      const qs = params.toString();
      startTransition(() => {
        onStart?.();
        router[mode](qs ? `/vacatures?${qs}` : "/vacatures", { scroll: false });
      });
    },
    [router],
  );
  const value = useMemo(() => ({ isPending, navigate }), [isPending, navigate]);
  return <VacancyNavigationContext value={value}>{children}</VacancyNavigationContext>;
}

export function useVacancyNavigation(): VacancyNavigation {
  const value = use(VacancyNavigationContext);
  if (!value) throw new Error("useVacancyNavigation vraagt VacancyNavigationProvider");
  return value;
}

/**
 * Resultatenregio: aria-busy tijdens navigatie; na 250 ms een dunne
 * voortgangsbalk en een gedimde lijst (via transition-delay, zonder timers).
 */
export function VacancyResultsRegion({
  children,
  labelledBy,
  updatingLabel,
}: {
  children: ReactNode;
  labelledBy: string;
  updatingLabel: string;
}) {
  const { isPending } = useVacancyNavigation();
  return (
    <section aria-labelledby={labelledBy} aria-busy={isPending} className="relative">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 -top-3 h-0.5 overflow-hidden rounded-full transition-opacity duration-150 motion-reduce:transition-none",
          isPending ? "opacity-100 delay-250" : "opacity-0",
        )}
      >
        <div className="h-full w-full animate-pulse bg-primary motion-reduce:animate-none" />
      </div>
      <p className="sr-only" aria-live="polite">
        {isPending ? updatingLabel : ""}
      </p>
      <div
        className={cn(
          "transition-opacity duration-150 motion-reduce:transition-none",
          isPending && "opacity-60 delay-250",
        )}
      >
        {children}
      </div>
    </section>
  );
}
