import type { ReactNode } from "react";

/**
 * Kaart voor de inlogschermen met de enige h1 (spec 08 §4.5). Opbouw naar
 * 21st.dev 21494 (ephraimduncan, Login with Email and Password): wit, smal,
 * gecentreerd, zonder sociale knoppen.
 */
export function AuthCard({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <div className="grid gap-2">
        <h1 className="text-[1.625rem] leading-tight">{title}</h1>
        {intro && <p className="text-base text-muted-foreground">{intro}</p>}
      </div>
      {children}
      {footer && <div className="grid gap-3 border-t border-border pt-5 text-sm">{footer}</div>}
    </div>
  );
}
