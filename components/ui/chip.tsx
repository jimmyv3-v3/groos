import * as React from "react";
import { Check, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const chipBase =
  "inline-flex h-11 items-center gap-2 rounded-full border border-border-strong bg-background px-4 text-sm font-medium text-foreground transition-colors duration-150 ease-brand hover:border-brand hover:text-brand-strong md:h-10 [&_svg]:size-4 [&_svg]:shrink-0";
const chipSelected = "border-brand bg-brand-tint text-brand-strong";

type ChipProps = {
  children: React.ReactNode;
  href?: string;
  selected?: boolean;
  count?: number;
  removeLabel?: string;
  className?: string;
};

/**
 * Filterchip: een link (met scroll={false}) of een <span>. Er is geen
 * ChipCheckbox: filters in een formulier gebruiken CheckboxField (spec 06).
 */
function Chip({ children, href, selected, count, removeLabel, className }: ChipProps) {
  const inner = (
    <>
      {selected && <Check aria-hidden="true" />}
      <span>{children}</span>
      {typeof count === "number" && (
        <span className="tabular-nums text-muted-foreground">{count}</span>
      )}
      {removeLabel && (
        <>
          <X aria-hidden="true" />
          <span className="sr-only">{removeLabel}</span>
        </>
      )}
    </>
  );
  const classes = cn(chipBase, selected && chipSelected, className);
  if (href) {
    return (
      <Link
        href={href}
        scroll={false}
        data-slot="chip"
        aria-current={selected ? "true" : undefined}
        className={classes}
      >
        {inner}
      </Link>
    );
  }
  return (
    <span data-slot="chip" className={classes}>
      {inner}
    </span>
  );
}

export { Chip };
