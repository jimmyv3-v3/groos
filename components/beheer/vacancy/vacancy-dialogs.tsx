"use client";

import { useState, useTransition } from "react";
import {
  archiveVacancy,
  closeVacancy,
  deleteVacancy,
  extendVacancy,
  publishVacancy,
  reopenVacancy,
  scheduleVacancy,
  takeOfflineVacancy,
  unscheduleVacancy,
} from "@/app/beheer/_actions/vacancies";
import { amsterdamDateKey, formatDateNl, isoToAmsterdamLocal } from "@/app/beheer/_lib/format";
import type { ActionResult } from "@/app/beheer/_lib/result";
import type { VacancyActionTarget } from "@/app/beheer/_lib/types";
import { S, fill } from "@/app/beheer/_strings";
import { VACANCY_EXTEND_DAYS } from "@/lib/data/options";
import { ConfirmDialog } from "@/components/beheer/confirm-dialog";
import { BeheerField } from "@/components/beheer/beheer-field";
import { useActionToast } from "@/components/beheer/action-toast";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/beheer/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { CtaButton, ctaButtonVariants } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";

export type VacancyDialogKey =
  | "publish"
  | "schedule"
  | "unschedule"
  | "takeOffline"
  | "closeFilled"
  | "close"
  | "reopen"
  | "extend"
  | "archive"
  | "delete"
  | "deleteBlocked";

const DAY = 24 * 60 * 60 * 1000;

function addDays(days: number): string {
  return amsterdamDateKey(new Date(Date.now() + days * DAY));
}

/**
 * Alle dialogen bij vacatures (spec 08 §4.3, teksten uit S.dialogs). Eén
 * dialoog tegelijk; open bepaalt welke.
 */
export function VacancyDialogs({
  vacancy,
  open,
  onOpenChange,
}: {
  vacancy: VacancyActionTarget;
  open: VacancyDialogKey | null;
  onOpenChange: (open: VacancyDialogKey | null) => void;
}) {
  const show = useActionToast();
  const close = (next: boolean) => {
    if (!next) onOpenChange(null);
  };
  const run = async (fn: () => Promise<ActionResult>) => {
    show(await fn());
  };
  const [now] = useState(() => Date.now());
  const id = vacancy.id;
  const extendBase = Math.max(vacancy.closesAt ? Date.parse(vacancy.closesAt) : 0, now);
  const extendTo = formatDateNl(new Date(extendBase + VACANCY_EXTEND_DAYS * DAY));
  const openApps = vacancy.openApplicationCount ?? 0;

  return (
    <>
      <ConfirmDialog
        open={open === "publish"}
        onOpenChange={close}
        title={S.dialogs.publish.title}
        body={S.dialogs.publish.body}
        confirmLabel={S.dialogs.publish.confirm}
        onConfirm={() => run(() => publishVacancy({ id }))}
      />
      <ConfirmDialog
        open={open === "unschedule"}
        onOpenChange={close}
        title={S.dialogs.unschedule.title}
        body={S.dialogs.unschedule.body}
        confirmLabel={S.dialogs.unschedule.confirm}
        onConfirm={() => run(() => unscheduleVacancy({ id }))}
      />
      <ConfirmDialog
        open={open === "takeOffline"}
        onOpenChange={close}
        title={S.dialogs.takeOffline.title}
        body={S.dialogs.takeOffline.body}
        confirmLabel={S.dialogs.takeOffline.confirm}
        onConfirm={() => run(() => takeOfflineVacancy({ id }))}
      />
      <ConfirmDialog
        open={open === "closeFilled"}
        onOpenChange={close}
        title={S.dialogs.closeFilled.title}
        body={S.dialogs.closeFilled.body}
        confirmLabel={S.dialogs.closeFilled.confirm}
        onConfirm={() => run(() => closeVacancy({ id, reason: "filled" }))}
      >
        {openApps > 0 && (
          <Alert tone="warning">{fill(S.dialogs.closeFilled.openApplications, { aantal: openApps })}</Alert>
        )}
      </ConfirmDialog>
      <ConfirmDialog
        open={open === "extend"}
        onOpenChange={close}
        title={S.dialogs.extend.title}
        body={fill(S.dialogs.extend.body, { datum: extendTo })}
        confirmLabel={S.dialogs.extend.confirm}
        onConfirm={() => run(() => extendVacancy({ id }))}
      />
      <ConfirmDialog
        open={open === "archive"}
        onOpenChange={close}
        title={S.dialogs.archive.title}
        body={S.dialogs.archive.body}
        confirmLabel={S.dialogs.archive.confirm}
        onConfirm={() => run(() => archiveVacancy({ id }))}
      />
      <ConfirmDialog
        open={open === "delete"}
        onOpenChange={close}
        tone="destructive"
        title={S.dialogs.delete.title}
        body={S.dialogs.delete.body}
        confirmLabel={S.dialogs.delete.confirm}
        onConfirm={async () => {
          const result = await deleteVacancy({ id });
          if (!result.ok && result.fieldErrors?._blocked) {
            setTimeout(() => onOpenChange("deleteBlocked"), 0);
            return;
          }
          show(result);
        }}
      />
      <ConfirmDialog
        open={open === "deleteBlocked"}
        onOpenChange={close}
        title={S.dialogs.deleteBlocked.title}
        body={S.dialogs.deleteBlocked.body}
        confirmLabel={S.dialogs.deleteBlocked.confirm}
        onConfirm={() => run(() => archiveVacancy({ id }))}
      />
      {open === "schedule" && <ScheduleDialog vacancy={vacancy} onClose={() => onOpenChange(null)} />}
      {open === "close" && <CloseDialog id={id} onClose={() => onOpenChange(null)} />}
      {open === "reopen" && <ReopenDialog id={id} onClose={() => onOpenChange(null)} />}
    </>
  );
}

function FormDialog({
  title,
  body,
  confirmLabel,
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onClose: () => void;
  onSubmit: (fd: FormData) => Promise<ActionResult>;
  children: (errors: Record<string, string[]>) => React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const show = useActionToast();
  const errors = result && !result.ok ? (result.fieldErrors ?? {}) : {};
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent closeLabel={S.common.close}>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              const r = await onSubmit(fd);
              setResult(r);
              if (r.ok) {
                show(r);
                onClose();
              } else if (!r.fieldErrors) {
                show(r);
              }
            });
          }}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
          {children(errors)}
          <DialogFooter>
            <DialogClose className={ctaButtonVariants({ variant: "secondary", size: "sm" })}>{S.common.cancel}</DialogClose>
            <CtaButton type="submit" size="sm" pending={pending} pendingLabel={S.common.saving}>
              {confirmLabel}
            </CtaButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ScheduleDialog({ vacancy, onClose }: { vacancy: VacancyActionTarget; onClose: () => void }) {
  const defaultPublish = vacancy.publishAt ? isoToAmsterdamLocal(vacancy.publishAt) : `${addDays(1)}T07:00`;
  const defaultCloses = vacancy.status === "scheduled" && vacancy.closesAt ? isoToAmsterdamLocal(vacancy.closesAt).slice(0, 10) : "";
  return (
    <FormDialog
      title={S.dialogs.schedule.title}
      body={S.dialogs.schedule.body}
      confirmLabel={S.dialogs.schedule.confirm}
      onClose={onClose}
      onSubmit={(fd) =>
        scheduleVacancy({
          id: vacancy.id,
          publishAt: String(fd.get("publishAt") ?? ""),
          closesOn: String(fd.get("closesOn") ?? "") || undefined,
        })
      }
    >
      {(errors) => (
        <>
          <BeheerField id="publishAt" label={S.dialogs.schedule.publishAt} error={errors.publishAt ?? errors.publish_at} required="always">
            <Input type="datetime-local" name="publishAt" defaultValue={defaultPublish} min={`${addDays(0)}T00:00`} required />
          </BeheerField>
          <BeheerField id="closesOn" label={S.dialogs.schedule.closesOn} hint={S.vacancies.form.fields.closes_at.hint} error={errors.closesOn}>
            <Input type="date" name="closesOn" defaultValue={defaultCloses} min={addDays(1)} />
          </BeheerField>
          {Object.keys(errors).some((k) => !["publishAt", "publish_at", "closesOn"].includes(k)) && (
            <Alert tone="warning" title={S.vacancies.form.checklistTitle}>
              <ul className="list-disc pl-5">
                {Object.entries(errors)
                  .filter(([k]) => !["publishAt", "publish_at", "closesOn"].includes(k))
                  .flatMap(([, msgs]) => msgs)
                  .map((m) => (
                    <li key={m}>{m}</li>
                  ))}
              </ul>
            </Alert>
          )}
        </>
      )}
    </FormDialog>
  );
}

function CloseDialog({ id, onClose }: { id: string; onClose: () => void }) {
  return (
    <FormDialog
      title={S.dialogs.close.title}
      body={S.dialogs.close.body}
      confirmLabel={S.dialogs.close.confirm}
      onClose={onClose}
      onSubmit={(fd) => closeVacancy({ id, reason: (String(fd.get("reason")) || "other") as "filled" | "withdrawn" | "other" })}
    >
      {() => (
        <RadioGroup legend={S.dialogs.close.reason}>
          {(["filled", "withdrawn", "other"] as const).map((r, i) => (
            <RadioCard key={r} id={`reden-${r}`} name="reason" value={r} label={S.options.closeReason[r]} defaultChecked={i === 0} />
          ))}
        </RadioGroup>
      )}
    </FormDialog>
  );
}

function ReopenDialog({ id, onClose }: { id: string; onClose: () => void }) {
  return (
    <FormDialog
      title={S.dialogs.reopen.title}
      body={S.dialogs.reopen.body}
      confirmLabel={S.dialogs.reopen.confirm}
      onClose={onClose}
      onSubmit={(fd) => reopenVacancy({ id, closesOn: String(fd.get("closesOn") ?? "") })}
    >
      {(errors) => (
        <BeheerField id="reopenClosesOn" label={S.dialogs.reopen.closesOn} error={errors.closesOn} required="always">
          <Input type="date" name="closesOn" defaultValue={addDays(30)} min={addDays(1)} required />
        </BeheerField>
      )}
    </FormDialog>
  );
}
