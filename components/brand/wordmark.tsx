import { cn } from "@/lib/utils";
import { brand } from "@/lib/brand";
import { contact } from "@/lib/site";
import { Monogram } from "./monogram";

/**
 * Volledig logo: beeldmerk + naam + descriptor eronder (zelfde opbouw als
 * J. Versseput). TODO (design): vervang door het echte logo zodra het er is.
 */
export function Wordmark({
  className,
  idSuffix = "lockup",
  showDescriptor = true,
}: {
  className?: string;
  idSuffix?: string;
  showDescriptor?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Monogram idSuffix={idSuffix} className="h-8 w-auto" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.95rem] font-medium uppercase tracking-[0.18em] text-foreground">
          {contact.shortName}
        </span>
        {showDescriptor && (
          <span className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.34em] text-muted-foreground">
            {brand.descriptor}
          </span>
        )}
      </span>
    </span>
  );
}
