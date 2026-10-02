"use client";

import { useTransition } from "react";
import { Archive, Ban, CircleCheck, RotateCcw } from "lucide-react";
import { setMessageStatus } from "@/app/beheer/_actions/messages";
import type { MessageStatus } from "@/lib/data/options";
import { S } from "@/app/beheer/_strings";
import { CtaButton } from "@/components/ui/cta-button";
import { useActionToast } from "./action-toast";
import { ConfirmDialog } from "./confirm-dialog";

/** Statusknoppen van een bericht; spam met bevestiging (spec 08 §4.10). */
export function MessageStatusButtons({ id, status }: { id: string; status: MessageStatus }) {
  const [pending, startTransition] = useTransition();
  const show = useActionToast();
  const D = S.messages.detail;
  const set = (next: MessageStatus) => startTransition(async () => void show(await setMessageStatus({ id, status: next })));

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "answered" && (
        <CtaButton size="sm" onClick={() => set("answered")} disabled={pending}>
          <CircleCheck aria-hidden="true" />
          {D.markAnswered}
        </CtaButton>
      )}
      {status !== "archived" && (
        <CtaButton size="sm" variant="secondary" onClick={() => set("archived")} disabled={pending}>
          <Archive aria-hidden="true" />
          {D.archive}
        </CtaButton>
      )}
      {status !== "spam" && (
        <ConfirmDialog
          title={S.dialogs.spam.title}
          body={S.dialogs.spam.body}
          confirmLabel={S.dialogs.spam.confirm}
          tone="destructive"
          onConfirm={async () => void show(await setMessageStatus({ id, status: "spam" }))}
          trigger={
            <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium text-destructive hover:bg-destructive-tint lg:h-10 [&_svg]:size-[1.125rem]">
              <Ban aria-hidden="true" />
              {D.markSpam}
            </button>
          }
        />
      )}
      {status !== "new" && (
        <CtaButton size="sm" variant="ghost" onClick={() => set("new")} disabled={pending}>
          <RotateCcw aria-hidden="true" />
          {D.markNew}
        </CtaButton>
      )}
    </div>
  );
}
