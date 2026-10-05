"use client";

import { useState, useTransition } from "react";
import { setApplicationStatus } from "@/app/beheer/_actions/applications";
import { setMessageStatus } from "@/app/beheer/_actions/messages";
import { setStaffRequestStatus } from "@/app/beheer/_actions/staff-requests";
import { amsterdamDateKey } from "@/app/beheer/_lib/format";
import type { ActionResult } from "@/app/beheer/_lib/result";
import { APPLICATION_FINAL, APPLICATION_STATUS_MAIL, type StatusMailKind } from "@/app/beheer/_lib/status";
import type { ApplicationStatus, MessageStatus, StaffRequestStatus } from "@/lib/data/options";
import { S } from "@/app/beheer/_strings";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/beheer/ui/dialog";
import { CheckboxField } from "@/components/ui/checkbox";
import { CtaButton, ctaButtonVariants } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { BeheerField } from "./beheer-field";
import { ConfirmDialog } from "./confirm-dialog";
import { useActionToast } from "./action-toast";

type Kind = "application" | "staffRequest" | "message";

/**
 * Statuskeuze met opslaan; bij een eindstatus van een sollicitatie eerst een
 * bevestiging (spec 08 §4.3). Bij Uitgenodigd, Afgewezen en Geplaatst kiest
 * de beheerder in de dialoog of de kandidaat een e-mail krijgt (canEmail).
 */
export function StatusForm({
  kind,
  id,
  current,
  options,
  canEmail = false,
}: {
  kind: Kind;
  id: string;
  current: string;
  options: string[];
  /** Alleen bij een sollicitatie: de kandidaat heeft een e-mailadres. */
  canEmail?: boolean;
}) {
  const [value, setValue] = useState(current);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
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

  const changed = value !== current;
  const needsConfirm = kind === "application" && (APPLICATION_FINAL as readonly string[]).includes(value) && changed;
  const mailKind = kind === "application" && canEmail && changed ? APPLICATION_STATUS_MAIL[value as ApplicationStatus] : undefined;

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        if (!changed) return;
        if (mailKind) setMailOpen(true);
        else if (needsConfirm) setConfirmOpen(true);
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
      <CtaButton type="submit" pending={pending} pendingLabel={S.common.saving} disabled={!changed}>
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
      {mailOpen && mailKind && (
        <StatusMailDialog id={id} status={value as ApplicationStatus} mailKind={mailKind} onClose={() => setMailOpen(false)} />
      )}
    </form>
  );
}

/** Dialoog bij een status met een e-mail: vinkje standaard aan, bij een uitnodiging ook datum en tijd. */
function StatusMailDialog({
  id,
  status,
  mailKind,
  onClose,
}: {
  id: string;
  status: ApplicationStatus;
  mailKind: StatusMailKind;
  onClose: () => void;
}) {
  const [notify, setNotify] = useState(true);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const show = useActionToast();
  const errors = result && !result.ok ? (result.fieldErrors ?? {}) : {};
  const D = S.dialogs.statusMail;
  const final = (APPLICATION_FINAL as readonly string[]).includes(status);
  const withMeeting = mailKind === "invitation" && notify;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent closeLabel={S.common.close}>
        {/* Geen <form>: de dialoog staat in React binnen het statusformulier en zou dat mee versturen. */}
        <div className="grid gap-4">
          <DialogTitle>{final ? S.dialogs.finalStatus.title : D.invitedTitle}</DialogTitle>
          <DialogDescription>{final ? S.dialogs.finalStatus.body : D.invitedBody}</DialogDescription>
          <CheckboxField
            id={`status-mail-${id}`}
            name="notify"
            label={D.notify[mailKind]}
            description={D.notifyHint[mailKind]}
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
          />
          {withMeeting && (
            <div className="grid gap-4 sm:grid-cols-2">
              <BeheerField id={`meeting-date-${id}`} label={D.date} error={errors.meetingDate} required="always">
                <Input
                  type="date"
                  name="meetingDate"
                  min={amsterdamDateKey(new Date())}
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  required
                />
              </BeheerField>
              <BeheerField id={`meeting-time-${id}`} label={D.time} error={errors.meetingTime} required="always">
                <Input type="time" name="meetingTime" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} required />
              </BeheerField>
            </div>
          )}
          <DialogFooter>
            <DialogClose className={ctaButtonVariants({ variant: "secondary", size: "sm" })}>{S.common.cancel}</DialogClose>
            <CtaButton
              type="button"
              size="sm"
              pending={pending}
              pendingLabel={S.common.saving}
              onClick={() =>
                startTransition(async () => {
                  const r = await setApplicationStatus({
                    id,
                    status,
                    notify,
                    meetingDate: withMeeting ? meetingDate : undefined,
                    meetingTime: withMeeting ? meetingTime : undefined,
                  });
                  setResult(r);
                  if (r.ok) {
                    show(r);
                    onClose();
                  } else if (!r.fieldErrors) {
                    show(r);
                  }
                })
              }
            >
              {D.confirm}
            </CtaButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
