import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Uitklaplijst op native <details> (werkt zonder JavaScript; antwoorden staan
 * in de DOM). Met dezelfde name gaat steeds één item open.
 */
function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-slot="accordion" className={cn("divide-y divide-border border-y border-border", className)}>
      {children}
    </div>
  );
}

type AccordionItemProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  name?: string;
  defaultOpen?: boolean;
  headingLevel?: "h2" | "h3";
  id?: string;
  className?: string;
};

function AccordionItem({
  title,
  children,
  name,
  defaultOpen,
  headingLevel,
  id,
  className,
}: AccordionItemProps) {
  const Title = headingLevel ?? "span";
  return (
    <details
      id={id}
      name={name}
      open={defaultOpen}
      data-slot="accordion-item"
      className={cn("accordion-item group", className)}
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-display text-h3 font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        <Title className="text-[length:inherit] font-[inherit] leading-[inherit] tracking-[inherit]">{title}</Title>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
          <Plus
            className="size-4 transition-transform duration-200 ease-brand group-open:rotate-45 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
      </summary>
      <div className="pr-12 pb-5 text-base text-muted-foreground">{children}</div>
    </details>
  );
}

export { Accordion, AccordionItem };
