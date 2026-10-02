import type { ReactNode } from "react";
import { signOut } from "@/app/beheer/_actions/auth";
import { CtaButton, type CtaButtonProps } from "@/components/ui/cta-button";

/** Formulier met de actie signOut (werkt zonder JavaScript). */
export function SignOutButton({
  children,
  scope = "local",
  variant = "secondary",
  className,
}: {
  children: ReactNode;
  scope?: "local" | "global";
  variant?: CtaButtonProps["variant"];
  className?: string;
}) {
  return (
    <form action={signOut}>
      <input type="hidden" name="scope" value={scope} />
      <CtaButton type="submit" variant={variant} className={className}>
        {children}
      </CtaButton>
    </form>
  );
}
