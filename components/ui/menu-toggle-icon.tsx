"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated hamburger that morphs into a close (X) icon. Three bars: the outer
 * two rotate to the centre to form the cross, the middle fades out. Pure CSS
 * transitions, driven by the `open` prop.
 */
export function MenuToggleIcon({
  open = false,
  className,
  duration = 300,
}: {
  open?: boolean;
  className?: string;
  duration?: number;
}) {
  const style: CSSProperties = { transitionDuration: `${duration}ms` };
  const bar =
    "absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-all ease-out";

  return (
    <span className={cn("relative block", className)} aria-hidden="true">
      <span
        className={cn(
          bar,
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[6px]",
        )}
        style={style}
      />
      <span
        className={cn(
          bar,
          "top-1/2 -translate-y-1/2",
          open ? "opacity-0" : "opacity-100",
        )}
        style={style}
      />
      <span
        className={cn(
          bar,
          open
            ? "top-1/2 -translate-y-1/2 -rotate-45"
            : "top-[calc(100%-6px)]",
        )}
        style={style}
      />
    </span>
  );
}
