import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Section title block. One h2 + an optional intro sentence. No eyebrows or
 * kicker labels, per the house copy rules.
 */
export function SectionHeading({
  title,
  accent,
  intro,
  align = "left",
  className,
}: {
  title: string;
  accent?: string;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2 className="text-h2">
        {title}{" "}
        {accent && <span className="accent-text">{accent}</span>}
      </h2>
      {intro && (
        <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">
          {intro}
        </p>
      )}
    </Reveal>
  );
}
