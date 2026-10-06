"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { S, fill } from "@/app/beheer/_strings";
import { CtaButton } from "@/components/ui/cta-button";
import { FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

/**
 * Lijst van regels met dezelfde name (spec 08 §4.3, SA-08-3: eigen primitive).
 * Na toevoegen gaat de focus naar de nieuwe regel, na verwijderen naar de vorige.
 * Elke regel is een tekstvak dat meegroeit, zodat een lange regel op een
 * telefoon helemaal leesbaar blijft; een regel blijft één regel tekst (Enter
 * voegt geen regeleinde toe en geplakte regeleinden worden spaties).
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
    requestAnimationFrame(() => listRef.current?.querySelectorAll("textarea")[index]?.focus());

  return (
    <fieldset id={`veld-${name}`} className="grid min-w-0 gap-2" aria-describedby={[hintId, errorId].filter(Boolean).join(" ")}>
      <legend className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-xs font-normal text-brand-strong">{S.common.requiredForPublish}</span>}
      </legend>
      <FieldDescription id={hintId}>{hint}</FieldDescription>
      <ul ref={listRef} className="grid grid-cols-[minmax(0,1fr)] gap-2">
        {rows.map((row, i) => (
          <li key={row.key} className="flex items-start gap-2">
            <span aria-hidden="true" className="w-5 shrink-0 pt-3 text-right text-sm tabular-nums text-muted-foreground">
              {i + 1}
            </span>
            <Textarea
              id={i === 0 ? name : undefined}
              name={name}
              defaultValue={row.value}
              maxLength={200}
              rows={2}
              enterKeyHint="done"
              aria-label={`${label} ${i + 1}`}
              aria-invalid={errorId ? true : undefined}
              className="h-auto min-h-12 resize-none py-2.5 leading-snug [field-sizing:content]"
              onKeyDown={(ev) => {
                if (ev.key === "Enter" && !ev.nativeEvent.isComposing) ev.preventDefault();
              }}
              onInput={(ev) => {
                const el = ev.currentTarget;
                if (el.value.includes("\n")) el.value = el.value.replace(/\s*\n\s*/g, " ");
              }}
            />
            <CtaButton
              variant="ghost"
              size="icon"
              className="shrink-0"
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
