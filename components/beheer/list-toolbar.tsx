"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { S } from "@/app/beheer/_strings";
import { CtaButton, ctaButtonVariants } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type ToolbarFilter = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
};

/**
 * Zoeken, filters en sortering als GET-formulier (spec 08 §4.3). Vanaf lg
 * staan de filters naast het zoekveld en lopen ze door op een volgende regel
 * als ze niet passen; daaronder staan ze in een Sheet. Beide sets
 * delen dezelfde staat; alleen de set in het formulier heeft namen, zodat
 * een waarde nooit dubbel meegaat. Zonder JavaScript werkt Zoeken.
 */
export function ListToolbar({
  searchLabel,
  searchPlaceholder,
  filters,
  sortOptions,
}: {
  searchLabel: string;
  searchPlaceholder: string;
  filters: ToolbarFilter[];
  sortOptions?: { value: string; label: string }[];
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const tab = params.get("tab");
  const selects = [...filters, ...(sortOptions ? [{ name: "sortering", label: S.vacancies.sortLabel, options: sortOptions }] : [])];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(selects.map((f) => [f.name, params.get(f.name) ?? ""])),
  );
  const activeCount = filters.filter((f) => values[f.name]).length;
  const clearHref = tab ? `${pathname}?tab=${encodeURIComponent(tab)}` : pathname;

  const renderSelect = (f: ToolbarFilter, withName: boolean, idPrefix: string) => (
    <div key={f.name} className="grid gap-2">
      <Label htmlFor={`${idPrefix}-${f.name}`}>{f.label}</Label>
      <NativeSelect
        id={`${idPrefix}-${f.name}`}
        name={withName ? f.name : undefined}
        value={values[f.name] ?? ""}
        onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
      >
        {f.name !== "sortering" && <NativeSelectOption value="">{S.common.all}</NativeSelectOption>}
        {f.options.map((o) => (
          <NativeSelectOption key={o.value} value={o.value}>
            {o.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );

  return (
    <form ref={formRef} id={formId} method="get" action={pathname} role="search" className="mb-5 grid gap-3">
      {tab && <input type="hidden" name="tab" value={tab} />}
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="grid flex-1 gap-2 lg:min-w-64">
          <Label htmlFor={`${formId}-q`}>{searchLabel}</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id={`${formId}-q`}
              type="search"
              name="q"
              defaultValue={params.get("q") ?? ""}
              placeholder={searchPlaceholder}
              maxLength={80}
              className="pl-11"
            />
          </div>
        </div>
        <div className="hidden lg:contents [&>div]:min-w-40 [&>div]:flex-1">
          {selects.map((f) => renderSelect(f, true, `${formId}-d`))}
        </div>
        <div className="flex gap-2">
          <CtaButton type="submit" className="flex-1 lg:flex-none">
            {S.common.search}
          </CtaButton>
          {selects.length > 0 && (
            <Sheet>
              <SheetTrigger className={ctaButtonVariants({ variant: "secondary", className: "lg:hidden" })}>
                <SlidersHorizontal aria-hidden="true" />
                {S.common.filters}
                {activeCount > 0 && (
                  <span className="rounded-full bg-primary px-2 text-xs text-primary-foreground tabular-nums">{activeCount}</span>
                )}
              </SheetTrigger>
              <SheetContent side="bottom" closeLabel={S.common.close}>
                <SheetHeader>
                  <SheetTitle>{S.common.filters}</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 overflow-y-auto p-5">{selects.map((f) => renderSelect(f, false, `${formId}-m`))}</div>
                <SheetFooter>
                  <Link href={clearHref} className={ctaButtonVariants({ variant: "secondary", className: "flex-1 max-sm:px-3" })}>
                    {S.common.clearFilters}
                  </Link>
                  <SheetClose
                    className={ctaButtonVariants({ className: "flex-1 max-sm:px-3" })}
                    onClick={() => setTimeout(() => formRef.current?.requestSubmit(), 0)}
                  >
                    {S.common.apply}
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
      {(activeCount > 0 || params.get("q")) && (
        <div>
          <Link href={clearHref} className="link inline-flex min-h-11 items-center text-sm">
            {S.common.clearFilters}
          </Link>
        </div>
      )}
    </form>
  );
}
