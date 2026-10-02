// STUB: wordt vervangen door spec 06
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/** Tijdelijk skelet met dezelfde rasterindeling als de stub van VacancyList. */
export function VacancyListSkeleton({
  count = 3,
  className,
}: {
  count?: number;
  variant?: "default" | "compact";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("grid gap-4 md:grid-cols-2", className)}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}
