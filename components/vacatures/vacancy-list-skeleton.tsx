import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { VacancyCardVariant } from "./types";

type Props = { count?: number; variant?: VacancyCardVariant; className?: string };

const META_WIDTHS = ["w-1/3", "w-1/2", "w-2/5", "w-1/4"];

/** Laadstaat met dezelfde afmetingen als de kaarten (spec 06 §8, geen CLS). */
export function VacancyListSkeleton({ count = 3, variant = "default", className }: Props) {
  const t = useTranslations("common");
  return (
    <div className={className}>
      <p className="sr-only" role="status" aria-live="polite">
        {t("loading")}
      </p>
      <ul role="list" aria-hidden="true" className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <Card className="h-full gap-0 p-0 md:p-0">
              <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <Skeleton className="h-7 w-2/3" />
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                </div>
                {variant === "default" && (
                  <div className="grid gap-1.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                )}
              </div>
              <div className="border-t border-border px-5 py-4 md:px-6">
                <Skeleton className="h-6 w-1/2" />
                <div className="mt-3 grid gap-1.5">
                  {META_WIDTHS.map((w) => (
                    <Skeleton key={w} className={cn("h-5", w)} />
                  ))}
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
