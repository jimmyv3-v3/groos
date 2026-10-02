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

/** Filterchip: een link (met scroll={false}) of een <span>. */
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

type ChipCheckboxProps = {
  name: string;
  value: string;
  children: React.ReactNode;
  defaultChecked?: boolean;
  count?: number;
  className?: string;
};

/** Chip als native checkbox, zodat filters zonder JavaScript als GET-formulier werken. */
function ChipCheckbox({ name, value, children, defaultChecked, count, className }: ChipCheckboxProps) {
  return (
    <label
      data-slot="chip"
      className={cn(
        chipBase,
        "group cursor-pointer has-[:checked]:border-brand has-[:checked]:bg-brand-tint has-[:checked]:text-brand-strong has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        className,
      )}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <Check className="hidden group-has-[:checked]:block" aria-hidden="true" />
      <span>{children}</span>
      {typeof count === "number" && (
        <span className="tabular-nums text-muted-foreground">{count}</span>
      )}
    </label>
  );
}

export { Chip, ChipCheckbox };
