import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CtaButton } from "@/components/ui/cta-button";
import type { CtaLink } from "./types";

/**
 * Knoppenrij van ServiceHero, ServiceCta en de lege vacaturestaat. Op 390 px
 * onder elkaar op volle breedte, vanaf sm naast elkaar. Een externe knop
 * (WhatsApp) opent in een nieuw venster en meldt dat met common.opensInNewTab.
 */
export function CtaLinks({ ctas, className }: { ctas: CtaLink[]; className?: string }) {
  const t = useTranslations("common");
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", className)}>
      {ctas.map((cta) => (
        <CtaButton
          key={`${cta.href}-${cta.label}`}
          href={cta.href}
          variant={cta.variant ?? "primary"}
          external={cta.external}
          ariaLabel={cta.ariaLabel}
          className="w-full sm:w-auto"
        >
          {cta.icon}
          {cta.label}
          {cta.external && <span className="sr-only"> {t("opensInNewTab")}</span>}
        </CtaButton>
      ))}
    </div>
  );
}
