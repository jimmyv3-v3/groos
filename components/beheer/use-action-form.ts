"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import type { ActionResult } from "@/app/beheer/_lib/result";

/**
 * useActionState met een onSubmit die de actie in een transition start.
 * Zo zet React de velden na een mislukte verzending niet terug (wel na een
 * gewone form action), en werkt het formulier zonder JavaScript via action.
 */
export function useActionForm<T = undefined>(
  action: (prev: ActionResult<T> | null, formData: FormData) => Promise<ActionResult<T>>,
) {
  const [state, formAction, pending] = useActionState<ActionResult<T> | null, FormData>(action, null);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const formData = new FormData(e.currentTarget, submitter);
    startTransition(() => formAction(formData));
  };
  const fieldErrors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  return { state, formAction, onSubmit, pending, fieldErrors };
}
