"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";

/** Label met "(niet verplicht)" achter optionele velden; geen sterretje (spec 07 §4.3). */
export function FieldLabelText({ label, required }: { label: React.ReactNode; required?: boolean }) {
  const t = useTranslations("forms.common");
  return (
    <>
      {label}
      {!required && <span className="font-normal text-muted-foreground"> ({t("optionalMark")})</span>}
    </>
  );
}

export function FieldLabel({ htmlFor, label, required }: { htmlFor: string; label: React.ReactNode; required?: boolean }) {
  return (
    <Label htmlFor={htmlFor}>
      <FieldLabelText label={label} required={required} />
    </Label>
  );
}

/** Vaste id's (spec 07 §4.3): invoer, hint en fout. */
export function fieldIds(formId: string, name: string) {
  const id = `${formId}-${name}`;
  return { id, hintId: `${id}-hint`, errorId: `${id}-error` };
}

export function describedBy(ids: { hintId: string; errorId: string }, hint?: string, error?: string) {
  return [hint ? ids.hintId : null, error ? ids.errorId : null].filter(Boolean).join(" ") || undefined;
}
