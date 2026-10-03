"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui-components/react/navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className,
      )}
      // Base UI zet aria-orientation op de <ul>; dat attribuut hoort niet bij de rol list (axe aria-allowed-attr).
      render={(listProps) => {
        const rest = { ...listProps };
        delete rest["aria-orientation"];
        return <ul {...rest} />;
      }}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  "group relative inline-flex h-10 w-max items-center justify-center gap-1 rounded-lg px-3 text-sm font-medium text-foreground transition-colors duration-150 ease-brand hover:bg-muted hover:text-brand-strong data-[popup-open]:bg-muted data-[active]:text-brand-strong aria-[current=page]:text-brand-strong aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-brand",
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-px size-4 text-muted-foreground transition duration-200 group-data-[popup-open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-[calc(100vw-40px)] sm:w-max",
        "transition-[opacity,transform,translate] duration-(--duration) ease-(--easing)",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        "data-starting-style:data-[activation-direction=left]:translate-x-[-50%]",
        "data-starting-style:data-[activation-direction=right]:translate-x-[50%]",
        "data-ending-style:data-[activation-direction=left]:translate-x-[50%]",
        "data-ending-style:data-[activation-direction=right]:translate-x-[-50%]",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuPortal({
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Portal>) {
  return (
    <NavigationMenuPrimitive.Portal data-slot="navigation-menu-portal" {...props} />
  );
}

function NavigationMenuPositioner({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Positioner>) {
  return (
    <NavigationMenuPortal>
      <NavigationMenuPrimitive.Positioner
        data-slot="navigation-menu-positioner"
        sideOffset={10}
        collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
        collisionAvoidance={{ side: "none" }}
        className={cn(
          "z-60 box-border h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5",
          className,
        )}
        style={
          {
            "--duration": "0.35s",
            "--easing": "cubic-bezier(0.22, 1, 0.36, 1)",
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPortal>
  );
}

function NavigationMenuPopup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Popup>) {
  return (
    <NavigationMenuPrimitive.Popup
      className={cn(
        "relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg transition-[opacity,transform,width,height,scale,translate] duration-(--duration) ease-(--easing) data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Popup>
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <NavigationMenuPrimitive.Viewport
      className={cn("relative h-full w-full overflow-hidden", className)}
      {...props}
    />
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-lg p-2 text-sm transition-colors duration-150 ease-brand hover:bg-muted hover:text-brand-strong data-[active]:bg-muted data-[active]:text-brand-strong",
        className,
      )}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuPortal,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuPositioner,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
  NavigationMenuPopup,
};
