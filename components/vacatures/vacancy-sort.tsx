"use client";

import type { ChangeEvent } from "react";
import type { VacancySort as VacancySortValue } from "@/lib/data/types";
import { CtaButton } from "@/components/ui/cta-button";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { normalizeEntries } from "./form-params";
import type { HiddenField } from "./types";
import { useVacancyNavigation } from "./vacancy-navigation";

type Props = {
  action: string;
  value: VacancySortValue;
  hidden: HiddenField[];
  labels: { label: string; apply: string; options: { nieuwste: string; salaris: string } };
};

/** Sorteren met een native keuzelijst (spec 06 §4.4); "sluitdatum" werkt alleen in de URL en toont "Nieuwste eerst". */
export function VacancySort({ action, value, hidden, labels }: Props) {
  const { navigate } = useVacancyNavigation();
  const selected = value === "salary" ? "salaris" : "nieuwste";

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const form = event.currentTarget.form;
    if (!form) return;
    navigate(normalizeEntries(new FormData(form).entries()), "replace");
  }

  return (
    <form method="get" action={action} className="flex items-center gap-2">
      <Label htmlFor="vacatures-sortering" className="shrink-0 whitespace-nowrap">
        {labels.label}
      </Label>
      <NativeSelect
        key={selected}
        id="vacatures-sortering"
        name="sortering"
        defaultValue={selected}
        onChange={onChange}
        className="h-11 min-w-44"
      >
        <NativeSelectOption value="nieuwste">{labels.options.nieuwste}</NativeSelectOption>
        <NativeSelectOption value="salaris">{labels.options.salaris}</NativeSelectOption>
      </NativeSelect>
      {hidden.map(([name, v], i) => (
        <input key={`${name}-${v}-${i}`} type="hidden" name={name} value={v} />
      ))}
      <noscript>
        <CtaButton type="submit" variant="secondary" size="sm">
          {labels.apply}
        </CtaButton>
      </noscript>
    </form>
  );
}
