import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconTileProps = {
  icon: LucideIcon;
  size?: "md" | "lg";
  tone?: "tint" | "brand" | "plain";
  className?: string;
};

const SIZES = { md: "size-11 rounded-lg [&_svg]:size-5", lg: "size-14 rounded-xl [&_svg]:size-6" };
const TONES = {
  tint: "bg-brand-tint text-brand",
  brand: "bg-primary text-primary-foreground",
  plain: "text-brand",
};

/** Lijnicoon in een rustige tegel; altijd decoratief naast tekst. */
function IconTile({ icon: Icon, size = "md", tone = "tint", className }: IconTileProps) {
  return (
    <span
      data-slot="icon-tile"
      className={cn("inline-grid shrink-0 place-items-center", SIZES[size], TONES[tone], className)}
    >
      <Icon strokeWidth={2} aria-hidden="true" />
    </span>
  );
}

export { IconTile };
