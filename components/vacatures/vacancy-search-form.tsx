"use client";

import { Search } from "lucide-react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CtaButton } from "@/components/ui/cta-button";
import { normalizeEntries } from "./form-params";
import type { HiddenField } from "./types";
import { useVacancyNavigation } from "./vacancy-navigation";

type Props = {
  action: string;
  defaultQuery: string;
  hidden: HiddenField[];
  labels: { form: string; label: string; placeholder: string; submit: string };
};

/** Zoeken op functie of plaats (spec 06 §4.4). GET-formulier; met JavaScript zonder volledige paginalading. */
export function VacancySearchForm({ action, defaultQuery, hidden, labels }: Props) {
  const { navigate } = useVacancyNavigation();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(normalizeEntries(new FormData(event.currentTarget).entries()), "push");
  }

  return (
    <form role="search" aria-label={labels.form} method="get" action={action} onSubmit={onSubmit} className="grid gap-2">
      <Label htmlFor="vacatures-zoekterm" className="text-base">
        {labels.label}
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            key={defaultQuery}
            id="vacatures-zoekterm"
            type="search"
            name="q"
            defaultValue={defaultQuery}
            maxLength={80}
            autoComplete="off"
            enterKeyHint="search"
            placeholder={labels.placeholder}
            className="pl-11"
          />
        </div>
        <CtaButton type="submit" className="sm:w-auto">
          {labels.submit}
        </CtaButton>
      </div>
      {hidden.map(([name, value], i) => (
        <input key={`${name}-${value}-${i}`} type="hidden" name={name} value={value} />
      ))}
    </form>
  );
}
