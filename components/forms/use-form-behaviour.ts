"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { z } from "zod";
import { track } from "@vercel/analytics";
import type { OccupationSlug } from "@/lib/data/options";
import {
  ARRAY_FIELDS,
  formDataToRecord,
  toFieldErrors,
  type FieldErrors,
  type FormId,
  type FormState,
} from "@/lib/validation/shared";

/**
 * Gedragslaag van de formulieren (spec 07 §4.3): clientvalidatie met het
 * gedeelde schema, focus naar de eerste fout, opnieuw valideren na de eerste
 * poging en de analytics-events form_start en form_invalid.
 */

const noopSubscribe = () => () => {};

/** True in de browser na hydratatie; false in de server-HTML en zonder JavaScript. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

type Analytics = { form: FormId; beroep?: OccupationSlug; vacature?: number };

function trackEvent(name: string, analytics: Analytics) {
  try {
    const props: Record<string, string | number> = { form: analytics.form };
    if (analytics.beroep) props.beroep = analytics.beroep;
    if (analytics.vacature !== undefined) props.vacature = analytics.vacature;
    track(name, props);
  } catch {
    // Analytics mag het formulier nooit raken.
  }
}

/** Zet de focus op het eerste ongeldige veld in DOM-volgorde. */
export function focusFirstInvalid(form: HTMLFormElement | null) {
  const target = form?.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (!target) return;
  const focusable =
    target instanceof HTMLFieldSetElement ? target.querySelector<HTMLElement>("input, select, textarea") : target;
  focusable?.focus();
}

export function useFormBehaviour(input: {
  formId: FormId;
  schema: z.ZodType;
  state: FormState;
  analytics: Analytics;
  isBusy?: () => boolean;
  onBusy?: () => void;
}): {
  formRef: React.RefObject<HTMLFormElement | null>;
  errors: FieldErrors;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onFieldChange: (name: string) => void;
  onFirstInteraction: () => void;
} {
  const { schema, state, analytics, isBusy, onBusy } = input;
  const formRef = useRef<HTMLFormElement | null>(null);
  const mountedAt = useRef(0);
  const started = useRef(false);
  const attempted = useRef(false);
  // Clientfouten horen bij één serverstate; een nieuw antwoord van de server vervangt ze.
  const [client, setClient] = useState<{ state: FormState; errors: FieldErrors } | null>(null);
  const [focusRequest, setFocusRequest] = useState(0);

  const serverErrors: FieldErrors = useMemo(
    () => (state.status === "idle" ? {} : (state.fieldErrors ?? {})),
    [state],
  );
  const errors = client && client.state === state ? client.errors : serverErrors;

  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  // Serverfouten: focus naar het eerste ongeldige veld en event form_invalid.
  useEffect(() => {
    if (state.status !== "invalid") return;
    attempted.current = true;
    trackEvent("form_invalid", analytics);
    focusFirstInvalid(formRef.current);
    // analytics is een object uit props; alleen een nieuwe serverstate telt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (focusRequest > 0) focusFirstInvalid(formRef.current);
  }, [focusRequest]);

  const validate = useCallback(
    (form: HTMLFormElement): FieldErrors => {
      const result = schema.safeParse(formDataToRecord(new FormData(form), ARRAY_FIELDS));
      return result.success ? {} : toFieldErrors(result.error);
    },
    [schema],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const form = e.currentTarget;
      attempted.current = true;
      if (isBusy?.()) {
        e.preventDefault();
        onBusy?.();
        return;
      }
      const found = validate(form);
      // Fouten die alleen de server of de upload kent (cv) blijven staan tot ze zijn opgelost.
      if (Object.keys(found).length > 0) {
        e.preventDefault();
        setClient({ state, errors: found });
        setFocusRequest((n) => n + 1);
        trackEvent("form_invalid", analytics);
        return;
      }
      const fill = form.elements.namedItem("fillMs");
      if (fill instanceof HTMLInputElement) {
        fill.value = String(Math.round(performance.now() - mountedAt.current));
      }
      setClient({ state, errors: {} });
    },
    [analytics, isBusy, onBusy, state, validate],
  );

  const onFieldChange = useCallback(
    (name: string) => {
      if (!attempted.current || !formRef.current) return;
      const found = validate(formRef.current);
      setClient((prev) => {
        const base = prev && prev.state === state ? prev.errors : serverErrors;
        // Het schema kent de cv-fouten niet; die blijven staan tot het cv-veld verandert.
        const next: FieldErrors = { ...found };
        if (base.cv && name !== "cv") next.cv = base.cv;
        return { state, errors: next };
      });
    },
    [serverErrors, state, validate],
  );

  const onFirstInteraction = useCallback(() => {
    if (started.current) return;
    started.current = true;
    trackEvent("form_start", analytics);
  }, [analytics]);

  return { formRef, errors, onSubmit, onFieldChange, onFirstInteraction };
}

/** Haalt `?<name>=` uit de URL in de browser (alleen na hydratatie gebruiken). */
export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}
