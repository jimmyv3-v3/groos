import type { ReactNode } from "react";

/**
 * Blok van het vacatureformulier als <fieldset> met een <legend> die een h2
 * bevat (spec 08 §4.3, §8). Opbouw naar 21st.dev 4347 (ephraimduncan, Form
 * Layout): kop en uitleg boven de velden, blokken onder elkaar. De legend
 * zweeft, zodat hij zich als gewone kop gedraagt en niet in de rand staat.
 */
export function FormBlock({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset id={id} className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <legend className="float-left mb-1 w-full p-0">
        <h2 className="text-[1.25rem] leading-snug">{title}</h2>
      </legend>
      <div className="clear-both grid min-w-0 gap-5">
        {description && <p className="-mt-1 text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
    </fieldset>
  );
}
