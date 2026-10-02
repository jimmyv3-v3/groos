"use client";

import { useState, useTransition } from "react";
import { setApplicationStatus } from "@/app/beheer/_actions/applications";
import { setMessageStatus } from "@/app/beheer/_actions/messages";
import { setStaffRequestStatus } from "@/app/beheer/_actions/staff-requests";
import { APPLICATION_FINAL } from "@/app/beheer/_lib/status";
import type { ApplicationStatus, MessageStatus, StaffRequestStatus } from "@/lib/data/options";
import { S } from "@/app/beheer/_strings";
import { CtaButton } from "@/components/ui/cta-button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "./confirm-dialog";
import { useActionToast } from "./action-toast";

type Kind = "application" | "staffRequest" | "message";

/** Statuskeuze met opslaan; bij een eindstatus van een sollicitatie eerst een bevestiging (spec 08 §4.3). */
export function StatusForm({ kind, id, current, options }: { kind: Kind; id: string; current: string; options: string[] }) {
  const [value, setValue] = useState(current);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const show = useActionToast();
  const labels = S.status[kind] as Record<string, string>;
  const selectId = `status-${id}`;

  async function save() {
    const result =
      kind === "application"
        ? await setApplicationStatus({ id, status: value as ApplicationStatus })
        : kind === "staffRequest"
          ? await setStaffRequestStatus({ id, status: value as StaffRequestStatus })
          : await setMessageStatus({ id, status: value as MessageStatus });
    show(result);
  }

  const needsConfirm = kind === "application" && (APPLICATION_FINAL as readonly string[]).includes(value) && value !== current;

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        if (value === current) return;
        if (needsConfirm) setConfirmOpen(true);
        else startTransition(save);
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor={selectId}>{S.statusForm.label}</Label>
        <NativeSelect id={selectId} name="status" value={value} onChange={(e) => setValue(e.target.value)}>
          {options.map((o) => (
            <NativeSelectOption key={o} value={o}>
              {labels[o] ?? o}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <CtaButton type="submit" pending={pending} pendingLabel={S.common.saving} disabled={value === current}>
        {S.statusForm.submit}
      </CtaButton>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={S.dialogs.finalStatus.title}
        body={S.dialogs.finalStatus.body}
        confirmLabel={S.dialogs.finalStatus.confirm}
        onConfirm={save}
      />
    </form>
  );
}
