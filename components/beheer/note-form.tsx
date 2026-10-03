"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNote } from "@/app/beheer/_actions/activities";
import type { ActionResult } from "@/app/beheer/_lib/result";
import { S } from "@/app/beheer/_strings";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { BeheerField } from "./beheer-field";
import { SubmitButton } from "./submit-button";

/** Notitie toevoegen aan de tijdlijn (spec 08 §4.3). */
export function NoteForm({ entityType, entityId }: { entityType: "application" | "staff_request"; entityId: string }) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(addNote, null);
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fieldId = `notitie-${entityId}`;

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.add({ title: state.toast, type: "success" });
      formRef.current?.reset();
    } else if (!state.fieldErrors) {
      toast.add({ title: state.message, type: "error" });
    }
    // toast is per render een nieuw object; alleen op een nieuwe state reageren.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3">
      <input type="hidden" name="entityType" value={entityType} />
      <input type="hidden" name="entityId" value={entityId} />
      <BeheerField
        id={fieldId}
        label={S.notes.label}
        hint={S.notes.hint}
        error={state && !state.ok ? state.fieldErrors?.body : undefined}
        required="always"
      >
        <Textarea name="body" rows={3} className="min-h-24" />
      </BeheerField>
      <div>
        <SubmitButton size="sm">{S.notes.submit}</SubmitButton>
      </div>
    </form>
  );
}
