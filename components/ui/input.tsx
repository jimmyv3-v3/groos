import * as React from "react";
import { cn } from "@/lib/utils";

/** Native invoerveld; 17 px voorkomt zoomen in iOS (spec 02 §4.7). */
export const fieldControlClasses =
  "h-12 w-full min-w-0 rounded-lg border border-input bg-background px-3.5 text-base text-foreground shadow-xs placeholder:text-muted-foreground transition-[border-color,box-shadow] focus-visible:outline-hidden focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldControlClasses, className)}
      {...props}
    />
  );
}

export { Input };
