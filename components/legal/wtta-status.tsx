import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WTTA } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const LINK = "underline underline-offset-4 hover:text-brand-strong";
/**
 * Tikvlak van minstens 44 px. In de footer staat de link onder lg op een eigen
 * regel onder de zin, net als de andere footerlinks; in het blok op de
 * Wtta-pagina staat hij al in een eigen alinea.
 */
const TAP = { footer: "max-lg:block max-lg:py-3", block: "inline-block py-2" } as const;

/**
 * Wtta-status per fase (spec 09 §4.6, B-24). De enige plek op de site die een
 * Wtta-status, toelating of registernummer noemt (CL-04). `footer` voor de
 * footer, `block` voor /werkgevers/wtta (geplaatst door spec 05).
 */
export async function WttaStatus({ variant, className }: { variant: "footer" | "block"; className?: string }) {
  if (WTTA.phase === "none") return null;
  const t = await getTranslations("legal.wtta");

  const text =
    WTTA.phase === "admitted"
      ? t(`${variant}.admitted`, { number: WTTA.registerNumber })
      : t(`${variant}.${WTTA.phase}`);

  const registerUrl = WTTA.phase === "provisional" || WTTA.phase === "admitted" ? WTTA.registerUrl : null;

  let link: React.ReactNode = null;
  if (registerUrl) {
    link = (
      <a href={registerUrl} rel="noopener noreferrer" className={cn(LINK, TAP[variant])}>
        {t("registerLink")}
      </a>
    );
  } else if (variant === "footer") {
    link = (
      <Link href={ROUTES.wtta} className={cn(LINK, TAP[variant])}>
        {t("infoLink")}
      </Link>
    );
  }

  if (variant === "footer") {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        {text}
        {link && <> {link}</>}
      </p>
    );
  }

  return (
    <div className={cn("grid gap-2 text-base text-foreground", className)}>
      <p>{text}</p>
      {link && <p>{link}</p>}
    </div>
  );
}
