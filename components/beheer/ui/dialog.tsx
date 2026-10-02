"use client";

import * as React from "react";
import { Dialog as Primitive } from "@base-ui-components/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ctaButtonVariants } from "@/components/ui/cta-button";

/** Dialoog op base-ui Dialog voor de vacaturedialogen (spec 08 §4.3). Zelfde vorm als AlertDialog. */
const Dialog = Primitive.Root;
const DialogTrigger = Primitive.Trigger;
const DialogClose = Primitive.Close;

function DialogContent({
  className,
  children,
  closeLabel,
  ...props
}: React.ComponentProps<typeof Primitive.Popup> & { closeLabel: string }) {
  return (
    <Primitive.Portal>
      <Primitive.Backdrop className="fixed inset-0 z-50 bg-ink/40 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
      <Primitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-2xl border border-border bg-background p-6 text-foreground shadow-lg outline-hidden transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {children}
        <Primitive.Close
          aria-label={closeLabel}
          className={ctaButtonVariants({ variant: "ghost", size: "icon", className: "absolute top-3 right-3" })}
        >
          <X aria-hidden="true" />
        </Primitive.Close>
      </Primitive.Popup>
    </Primitive.Portal>
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof Primitive.Title>) {
  return (
    <Primitive.Title
      data-slot="dialog-title"
      className={cn("pr-10 font-display text-h3 font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof Primitive.Description>) {
  return (
    <Primitive.Description
      data-slot="dialog-description"
      className={cn("text-base text-muted-foreground", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-6 mt-2 -mb-6 flex flex-col-reverse gap-3 rounded-b-2xl border-t border-border bg-muted px-6 py-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription, DialogFooter };
