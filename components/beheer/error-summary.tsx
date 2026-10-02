"use client";

import { useEffect, useRef } from "react";
import { S, fill } from "@/app/beheer/_strings";

/** Foutlijst bovenaan een formulier; krijgt focus na een mislukte verzending (spec 08 §4.3). */
export function ErrorSummary({ errors }: { errors: { field: string; message: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (errors.length > 0) ref.current?.focus();
  }, [errors]);
  if (errors.length === 0) return null;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="grid gap-2 rounded-xl border border-destructive/25 bg-destructive-tint p-4 text-destructive-strong outline-hidden focus-visible:ring-2 focus-visible:ring-destructive"
    >
      <p className="font-semibold">
        {errors.length === 1 ? S.errors.errorSummaryOne : fill(S.errors.errorSummaryMany, { aantal: errors.length })}
      </p>
      <ul className="grid list-disc gap-1 pl-5">
        {errors.map((e) => (
          <li key={`${e.field}-${e.message}`}>
            <a href={`#veld-${e.field}`} className="underline underline-offset-4">
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
