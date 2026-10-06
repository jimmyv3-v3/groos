"use client";

import * as React from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ctaButtonVariants } from "@/components/ui/cta-button";

/** Paneel van rechts of onder (base-ui Dialog), voor de filters van /vacatures. */
const Sheet = Dialog.Root;

function SheetTrigger(props: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close data-slot="sheet-close" {...props} />;
}

type SheetContentProps = {
  side?: "right" | "bottom";
  closeLabel: string;
  children: React.ReactNode;
  className?: string;
};

function SheetContent({ side = "right", closeLabel, children, className }: SheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop
        data-slot="sheet-backdrop"
        className="fixed inset-0 z-50 bg-ink/40 transition-opacity duration-200 ease-brand data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none"
      />
      <Dialog.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col bg-background text-foreground shadow-lg outline-hidden transition-transform duration-200 ease-brand motion-reduce:transition-none",
          side === "right" &&
            "inset-y-0 right-0 w-full data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full sm:max-w-md",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full",
          className,
        )}
      >
        {children}
        <Dialog.Close
          aria-label={closeLabel}
          data-slot="cta-button"
          className={ctaButtonVariants({ variant: "ghost", size: "icon", className: "absolute top-3 right-3" })}
        >
          <X aria-hidden="true" />
        </Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("grid gap-1 border-b border-border p-5 pr-16", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "sticky bottom-0 mt-auto flex gap-3 border-t border-border bg-background p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title data-slot="sheet-title" className={cn("font-display text-h3 font-semibold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
