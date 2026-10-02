import { useTranslations } from "next-intl";
import { usps } from "@/lib/site";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export function TrustBar() {
  const t = useTranslations("home.trustBar");
  const items = t.raw("items") as { title: string; body: string }[];
  return (
    <section
      aria-label={t("ariaLabel")}
      className="relative border-y border-border/60 bg-card/30"
    >
      <div className="container py-16 sm:py-20">
        <RevealGroup
          className="grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4"
          stagger={0.08}
          delayChildren={0.05}
        >
          {usps.map((usp, i) => (
            <RevealItem
              key={items[i].title}
              as="li"
              className="group relative list-none px-4 py-6 sm:px-6 sm:py-8"
            >
              {/* Soft column divider — right edge, hidden after last item */}
              {i < usps.length - 1 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-6 right-0 hidden w-px bg-border/40 lg:block"
                />
              )}

              {/* Icoontegel met ring en gloed bij hover */}
              <span
                aria-hidden
                className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-[0.4rem] border border-border/70 bg-card/40 ring-1 ring-inset ring-foreground/4 transition-all duration-300 group-hover:border-border group-hover:bg-card/70"
              >
                <usp.icon
                  aria-hidden
                  className="h-[1.1rem] w-[1.1rem] text-brand transition-colors duration-300 group-hover:text-brand-strong"
                />
              </span>

              <h3 className="font-display text-h3 font-semibold text-foreground">
                {items[i].title}
              </h3>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground sm:text-sm">
                {items[i].body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
