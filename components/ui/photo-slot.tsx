import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const RATIOS = { "4/5": "aspect-[4/5]", "3/2": "aspect-[3/2]", "1/1": "aspect-square", "16/9": "aspect-video" };

type PhotoSlotProps = {
  src?: string;
  alt: string;
  ratio?: keyof typeof RATIOS;
  sizes: string;
  priority?: boolean;
  fallback?: ReactNode;
  className?: string;
};

/** Optionele fotoplek (B-25): zonder src een rustig vlak met het oo-patroon. */
function PhotoSlot({ src, alt, ratio = "3/2", sizes, priority, fallback, className }: PhotoSlotProps) {
  return (
    <div
      data-slot="photo-slot"
      aria-hidden={src ? undefined : true}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-brand-tint",
        RATIOS[ratio],
        !src && "pattern-oo grid place-items-center",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        fallback
      )}
    </div>
  );
}

export { PhotoSlot };
