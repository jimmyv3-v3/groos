"use client";

import * as React from "react";
import { Menu as Primitive } from "@base-ui-components/react/menu";
import { cn } from "@/lib/utils";

/** Rijmenu op base-ui Menu (spec 08 §4.3). Items minimaal 44 px hoog. */
const Menu = Primitive.Root;
const MenuTrigger = Primitive.Trigger;

function MenuContent({ className, children, ...props }: React.ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Portal>
      <Primitive.Positioner sideOffset={6} align="end" className="z-50 outline-hidden">
        <Primitive.Popup
          data-slot="menu-content"
          className={cn(
            "max-h-[min(var(--available-height),28rem)] min-w-56 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-hidden transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          {children}
        </Primitive.Popup>
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}

function MenuItem({ className, ...props }: React.ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      data-slot="menu-item"
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-base text-foreground outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-muted [&_svg]:size-[1.125rem] [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MenuSeparator({ className, ...props }: React.ComponentProps<typeof Primitive.Separator>) {
  return <Primitive.Separator className={cn("my-1.5 h-px bg-border", className)} {...props} />;
}

export { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator };
