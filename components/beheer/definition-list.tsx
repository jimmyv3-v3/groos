import type { ReactNode } from "react";

/**
 * Gegevens als <dl>; op mobiel term boven waarde (opmaak naar 21st.dev 25162).
 * Lange e-mailadressen en bestandsnamen breken binnen de kaart (wrap-anywhere).
 */
export function DefinitionList({ items }: { items: { term: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-border">
      {items.map((item) => (
        <div key={item.term} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(10rem,14rem)_1fr] sm:gap-4">
          <dt className="text-sm text-muted-foreground">{item.term}</dt>
          <dd className="min-w-0 text-base wrap-anywhere whitespace-pre-line text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
