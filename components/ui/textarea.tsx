import * as React from "react";
import { cn } from "@/lib/utils";
import { fieldControlClasses } from "@/components/ui/input";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldControlClasses, "min-h-32 resize-y py-3", className)}
      {...props}
    />
  );
}

export { Textarea };
