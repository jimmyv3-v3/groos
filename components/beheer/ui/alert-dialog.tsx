"use client";

import * as React from "react";
import { AlertDialog as Primitive } from "@base-ui-components/react/alert-dialog";
import { cn } from "@/lib/utils";

/**
 * Bevestigingsdialoog op base-ui AlertDialog (spec 08 §4.3). Opbouw naar
 * 21st.dev 26651 (soralabs, Base Alert Dialog): kop, beschrijving en een
 * voetbalk; zonder motion, blur of 3D. Focus blijft in de dialoog, Escape
 * sluit en de focus gaat terug naar de knop die hem opende.
 */
const AlertDialog = Primitive.Root;
const AlertDialogTrigger = Primitive.Trigger;
const AlertDialogClose = Primitive.Close;

function AlertDialogContent({ className, children, ...props }: React.ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Portal>
      <Primitive.Backdrop className="fixed inset-0 z-50 bg-ink/40 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
      <Primitive.Popup
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-2xl border border-border bg-background p-6 text-foreground shadow-lg outline-hidden transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {children}
      </Primitive.Popup>
    </Primitive.Portal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("grid gap-2", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof Primitive.Title>) {
  return (
    <Primitive.Title
      data-slot="alert-dialog-title"
      className={cn("font-display text-h3 font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof Primitive.Description>) {
  return (
    <Primitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-base text-muted-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        // Blijft onderin de dialoog staan als de inhoud langer is dan het scherm (telefoon).
        "sticky -bottom-6 -mx-6 mt-2 -mb-6 flex flex-col-reverse gap-3 rounded-b-2xl border-t border-border bg-muted px-6 py-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
};
