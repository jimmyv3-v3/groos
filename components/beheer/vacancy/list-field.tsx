"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { S, fill } from "@/app/beheer/_strings";
import { CtaButton } from "@/components/ui/cta-button";
import { FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/**
 * Lijst van regels met dezelfde name (spec 08 §4.3, SA-08-3: eigen primitive).
 * Na toevoegen gaat de focus naar de nieuwe regel, na verwijderen naar de vorige.
 */
export function ListField({
  name,
  label,
  hint,
  addLabel,
  removeLabel,
  initial,
  min,
  max,
  error,
  required,
}: {
  name: "tasks" | "requirements" | "offer";
  label: string;
  hint: string;
  addLabel: string;
  removeLabel: string;
  initial: string[];
  min: number;
  max: 10;
  error?: string[];
  required?: boolean;
}) {
  const [rows, setRows] = useState(() => {
    const start = initial.length > 0 ? initial : [""];
    const filled: string[] = [...start, ...Array(Math.max(0, min - start.length)).fill("")];
    return filled.map((value, key) => ({ key, value }));
  });
  const makeRow = (value: string) => ({ key: Math.max(-1, ...rows.map((r) => r.key)) + 1, value });
  const listRef = useRef<HTMLUListElement>(null);
  const hintId = `${name}-hint`;
  const errorId = error?.length ? `${name}-fout` : undefined;

  const focusRow = (index: number) =>
    requestAnimationFrame(() => listRef.current?.querySelectorAll("input")[index]?.focus());

  return (
    <fieldset id={`veld-${name}`} className="grid min-w-0 gap-2" aria-describedby={[hintId, errorId].filter(Boolean).join(" ")}>
      <legend className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-xs font-normal text-brand-strong">{S.common.requiredForPublish}</span>}
      </legend>
      <FieldDescription id={hintId}>{hint}</FieldDescription>
      <ul ref={listRef} className="grid gap-2">
        {rows.map((row, i) => (
          <li key={row.key} className="flex items-center gap-2">
            <span aria-hidden="true" className="w-5 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
              {i + 1}
            </span>
            <Input
              id={i === 0 ? name : undefined}
              name={name}
              defaultValue={row.value}
              maxLength={200}
              aria-label={`${label} ${i + 1}`}
              aria-invalid={errorId ? true : undefined}
            />
            <CtaButton
              variant="ghost"
              size="icon"
              ariaLabel={fill(removeLabel, { nummer: i + 1 })}
              disabled={rows.length <= 1}
              onClick={() => {
                setRows((r) => r.filter((x) => x.key !== row.key));
                focusRow(Math.max(0, i - 1));
              }}
            >
              <X aria-hidden="true" />
            </CtaButton>
          </li>
        ))}
      </ul>
      {rows.length < max && (
        <CtaButton
          variant="tint"
          size="sm"
          className="justify-self-start"
          onClick={() => {
            setRows((r) => [...r, makeRow("")]);
            focusRow(rows.length);
          }}
        >
          <Plus aria-hidden="true" />
          {addLabel}
        </CtaButton>
      )}
      {errorId && <FieldError id={errorId}>{error!.join(" ")}</FieldError>}
    </fieldset>
  );
}
