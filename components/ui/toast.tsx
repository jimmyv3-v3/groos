"use client";

import { Toast } from "@base-ui-components/react/toast";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { ctaButtonVariants } from "@/components/ui/cta-button";

/** Meldingen in het beheer (base-ui Toast). De publieke site gebruikt Alert. */
const ToastProvider = Toast.Provider;

type AddToast = {
  title: string;
  description?: string;
  type?: "success" | "error";
};

function useToast() {
  const manager = Toast.useToastManager();
  return {
    ...manager,
    add: ({ title, description, type = "success" }: AddToast) =>
      manager.add({ title, description, type, timeout: 5000 }),
  };
}

function ToastList({ closeLabel }: { closeLabel: string }) {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="flex w-full items-start gap-3 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg transition-[opacity,transform] duration-200 ease-brand data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 motion-reduce:transition-none"
    >
      {toast.type === "error" ? (
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
      ) : (
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
      )}
      <div className="grid flex-1 gap-0.5">
        <Toast.Title className="text-base font-semibold" />
        <Toast.Description className="text-sm text-muted-foreground" />
      </div>
      <Toast.Close
        aria-label={closeLabel}
        data-slot="cta-button"
        className={ctaButtonVariants({ variant: "ghost", size: "icon", className: "-m-2 shrink-0" })}
      >
        <X aria-hidden="true" />
      </Toast.Close>
    </Toast.Root>
  ));
}

function Toaster({ closeLabel }: { closeLabel: string }) {
  return (
    <Toast.Portal>
      <Toast.Viewport
        aria-live="polite"
        className="fixed inset-x-4 bottom-4 z-[60] mx-auto grid max-w-sm gap-3 md:inset-x-auto md:right-6 md:bottom-6"
      >
        <ToastList closeLabel={closeLabel} />
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export { ToastProvider, Toaster, useToast };
