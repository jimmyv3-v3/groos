"use client";

import { useState, useTransition, type ReactElement, type ReactNode } from "react";
import { CtaButton } from "@/components/ui/cta-button";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/beheer/ui/alert-dialog";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { S } from "@/app/beheer/_strings";

/**
 * Bevestiging op AlertDialog (spec 08 §4.3). trigger is het element dat de
 * dialoog opent (via render, zodat het eigen knopelement blijft). Zonder
 * trigger is de dialoog gestuurd met open en onOpenChange.
 */
export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  tone = "default",
  onConfirm,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  tone?: "default" | "destructive";
  onConfirm: () => Promise<void> | void;
  trigger?: ReactElement<Record<string, unknown>>;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [innerOpen, setInnerOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const open = controlledOpen ?? innerOpen;
  const setOpen = (next: boolean) => {
    setInnerOpen(next);
    onOpenChange?.(next);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger render={trigger} />}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogClose className={ctaButtonVariants({ variant: "secondary", size: "sm" })}>
            {S.common.cancel}
          </AlertDialogClose>
          <CtaButton
            size="sm"
            variant={tone === "destructive" ? "destructive" : "primary"}
            pending={pending}
            pendingLabel={S.common.saving}
            onClick={() =>
              startTransition(async () => {
                await onConfirm();
                setOpen(false);
              })
            }
          >
            {confirmLabel}
          </CtaButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
