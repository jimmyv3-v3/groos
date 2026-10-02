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
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2 className="font-display text-2xl font-light leading-tight tracking-tight text-foreground sm:text-3xl">
        {title}{" "}
        {accent && <span className="accent-text font-normal">{accent}</span>}
      </h2>
      {intro && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {intro}
        </p>
      )}
    </Reveal>
  );
}
