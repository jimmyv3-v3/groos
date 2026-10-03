"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useOptimistic } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { CtaButton } from "@/components/ui/cta-button";
import { normalizeEntries } from "./form-params";
import type { FilterGroup, FilterOption, HiddenField } from "./types";
import { useVacancyNavigation } from "./vacancy-navigation";

type Props = {
  action: string;
  groups: FilterGroup[];
  hidden: HiddenField[];
  idPrefix: string;
  labels: { heading: string; apply: string };
  headingLevel?: "h2";
};

const keyOf = (name: string, value: string) => `${name}=${value}`;

/**
 * Filterpaneel met vier fieldsets (spec 06 §4.4 en §4.5). Zonder JavaScript
 * een GET-formulier met de knop "Filters toepassen"; met JavaScript ververst
 * elke wijziging direct de lijst en staat het vinkje meteen (useOptimistic).
 */
export function VacancyFilters({ action, groups, hidden, idPrefix, labels, headingLevel }: Props) {
  const { navigate } = useVacancyNavigation();
  const serverChecked = useMemo(
    () => groups.flatMap((g) => g.options.filter((o) => o.checked).map((o) => keyOf(g.name, o.value))),
    [groups],
  );
  const [checked, setChecked] = useOptimistic(serverChecked, (_current, next: string[]) => next);
  const checkedSet = new Set(checked);
  // Zonder JavaScript staat de knop er gewoon; binnen de <noscript>-variant geen geneste noscript.
  const insideNoscript = idPrefix === "noscript";

  function toggle(name: string, value: string) {
    const key = keyOf(name, value);
    const next = checkedSet.has(key) ? checked.filter((k) => k !== key) : [...checked, key];
    const entries: [string, string][] = [
      ...hidden,
      ...groups.flatMap((g) =>
        g.options.filter((o) => next.includes(keyOf(g.name, o.value))).map((o): [string, string] => [g.name, o.value]),
      ),
    ];
    navigate(normalizeEntries(entries), "replace", () => setChecked(next));
  }

  function renderOption(group: FilterGroup, option: FilterOption) {
    const id = `${idPrefix}-${group.name}-${option.value}`;
    const isChecked = checkedSet.has(keyOf(group.name, option.value));
    const disabled = option.count === 0 && !isChecked;
    return (
      <li key={option.value}>
        <label
          htmlFor={id}
          className={cn(
            "-mx-2 flex min-h-11 items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 motion-reduce:transition-none",
            disabled ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer hover:bg-muted",
          )}
        >
          <Checkbox
            id={id}
            name={group.name}
            value={option.value}
            checked={isChecked}
            disabled={disabled}
            onChange={() => toggle(group.name, option.value)}
            aria-describedby={`${id}-count`}
          />
          <span className="min-w-0 flex-1 text-base">{option.label}</span>
          <span aria-hidden="true" className="ms-auto text-sm tabular-nums text-muted-foreground">
            {option.count}
          </span>
        </label>
        <span id={`${id}-count`} className="sr-only">
          {option.countAria}
        </span>
      </li>
    );
  }

  const applyButton = (
    <CtaButton type="submit" variant="secondary" className="w-full">
      {labels.apply}
    </CtaButton>
  );

  return (
    <form method="get" action={action} aria-label={headingLevel ? undefined : labels.heading} className="grid gap-6">
      {headingLevel === "h2" && (
        <h2 className="border-b border-border pb-3 text-h3">{labels.heading}</h2>
      )}
      {groups.map((group) => {
        const limit = group.collapseAfter ?? Infinity;
        const visible = group.options.filter((o, i) => i < limit || o.checked);
        const rest = group.options.filter((o, i) => !(i < limit || o.checked));
        return (
          <fieldset key={group.name} className="grid gap-1">
            <legend className="mb-1 text-sm font-semibold text-foreground">{group.legend}</legend>
            <ul role="list" className="grid">
              {visible.map((option) => renderOption(group, option))}
            </ul>
            {rest.length > 0 && (
              <details className="group">
                <summary className="-mx-2 flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-brand hover:text-brand-strong [&::-webkit-details-marker]:hidden">
                  {group.moreLabel}
                  <ChevronDown
                    className="size-4 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <ul role="list" className="grid">
                  {rest.map((option) => renderOption(group, option))}
                </ul>
              </details>
            )}
          </fieldset>
        );
      })}
      {hidden.map(([name, value], i) => (
        <input key={`${name}-${value}-${i}`} type="hidden" name={name} value={value} />
      ))}
      {insideNoscript ? applyButton : <noscript>{applyButton}</noscript>}
    </form>
  );
}
