import { Skeleton } from "@/components/ui/skeleton";
import { S } from "../_strings";

/** Skelet met de vorm van een paginakop en vijf rijen (spec 08 §4.11). */
export default function Loading() {
  return (
    <div className="grid gap-6">
      <p aria-live="polite" className="sr-only">
        {S.app.loading}
      </p>
      <div className="grid gap-3">
        <Skeleton className="h-9 w-2/3 max-w-sm" />
        <Skeleton className="h-5 w-1/2 max-w-xs" />
      </div>
      <div className="grid gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
