import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WTTA } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const LINK = "underline underline-offset-4 hover:text-brand-strong";

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
      <a href={registerUrl} rel="noopener noreferrer" className={LINK}>
        {t("registerLink")}
      </a>
    );
  } else if (variant === "footer") {
    link = (
      <Link href={ROUTES.wtta} className={LINK}>
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
