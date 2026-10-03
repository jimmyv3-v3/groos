"use client";

import type { ChangeEvent } from "react";
import { CtaButton } from "@/components/ui/cta-button";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { normalizeEntries } from "./form-params";
import type { HiddenField } from "./types";
import { useVacancyNavigation } from "./vacancy-navigation";

type Props = {
  action: string;
  /** Waarde van ?sortering in de keuzelijst; "sluitdatum" werkt alleen in de URL en toont "nieuwste" (spec 06 §5.1). */
  value: "nieuwste" | "salaris";
  hidden: HiddenField[];
  labels: { label: string; apply: string; options: { nieuwste: string; salaris: string } };
};

/** Sorteren met een native keuzelijst (spec 06 §4.4). Zonder JavaScript met de knop in <noscript>. */
export function VacancySortSelect({ action, value, hidden, labels }: Props) {
  const { navigate } = useVacancyNavigation();

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
        key={value}
        id="vacatures-sortering"
        name="sortering"
        defaultValue={value}
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
