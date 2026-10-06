import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "flex flex-col gap-4 rounded-2xl border bg-card p-6 text-card-foreground md:p-7",
  {
    variants: {
      variant: {
        default: "border-border",
        muted: "border-transparent bg-muted",
        tint: "border-transparent bg-brand-tint",
        interactive:
          "relative border-border transition-[border-color,box-shadow,translate] duration-200 ease-brand hover:border-brand/40 hover:shadow-md motion-safe:hover:-translate-y-0.5 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type CardProps = {
  variant?: "default" | "muted" | "tint" | "interactive";
} & React.ComponentProps<"div">;

/**
 * Kaart zonder schaduw in rust, met een rand van 1 px in het border-token. Bij
 * een klikbare kaart (interactive) krijgt de hoofdlink after:absolute
 * after:inset-0; één link per kaart. Hover: randkleur, lichte schaduw en een
 * halve pixelstap omhoog (niet bij reduced motion).
 */
function Card({ className, variant, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("grid gap-2", className)} {...props} />;
}

function CardTitle({
  as: Tag = "h3",
  className,
  ...props
}: { as?: "h2" | "h3" | "p" } & React.ComponentProps<"h3">) {
  return (
    <Tag
      data-slot="card-title"
      className={cn("font-display text-h3 font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-base text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn(className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-footer" className={cn("mt-auto flex items-center gap-3", className)} {...props} />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
