import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { VacancyCardVariant } from "./types";

type Props = { count?: number; variant?: VacancyCardVariant; className?: string };

const META_WIDTHS = ["w-1/3", "w-3/4", "w-1/2", "w-2/5", "w-1/4"];

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
            <Card className="h-full gap-3 p-5 md:p-5">
              <Skeleton className="h-7 w-2/3" />
              <div className="grid gap-1.5">
                {META_WIDTHS.map((w) => (
                  <Skeleton key={w} className={cn("h-5", w)} />
                ))}
              </div>
              {variant === "default" && (
                <div className="grid gap-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
