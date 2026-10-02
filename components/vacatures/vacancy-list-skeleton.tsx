// STUB: wordt vervangen door spec 06
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type VacancyCardVariant = "default" | "compact";

/** Tijdelijk skelet met de maat van een compacte of gewone vacaturekaart (spec 06 §4.6). */
export function VacancyListSkeleton({
  count = 3,
  variant = "default",
  className,
}: {
  count?: number;
  variant?: VacancyCardVariant;
  className?: string;
}) {
  return (
    <ul role="list" aria-hidden className={cn("mt-8 grid gap-4 md:grid-cols-2", className)}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <Skeleton className={cn("rounded-2xl", variant === "compact" ? "h-40" : "h-52")} />
        </li>
      ))}
    </ul>
  );
}
