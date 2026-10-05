"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui-components/react/tabs";
import { cn } from "@/lib/utils";

type Variant = "underline" | "segmented";
const VariantContext = React.createContext<Variant>("underline");

/** Tabs op base-ui; niet voor inhoud die zonder JavaScript zichtbaar moet zijn. */
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("grid gap-6", className)} {...props} />;
}

function TabsList({
  variant = "underline",
  className,
  ...props
}: { variant?: Variant } & React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(
          variant === "underline"
            ? "flex gap-6 overflow-x-auto border-b border-border"
            : "inline-flex rounded-lg bg-muted p-1",
          className,
        )}
        {...props}
      />
    </VariantContext.Provider>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  const variant = React.useContext(VariantContext);
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "cursor-pointer font-medium whitespace-nowrap transition-colors duration-150 ease-brand",
        variant === "underline"
          ? "relative -mb-px h-12 border-b-2 border-transparent text-base text-muted-foreground hover:text-foreground data-[active]:border-brand data-[active]:text-foreground"
          : "h-11 rounded-md px-4 text-sm lg:h-10 text-muted-foreground hover:text-foreground data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn(className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
