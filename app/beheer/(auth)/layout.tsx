import { Logo } from "@/components/brand/logo";
import { S } from "../_strings";

/** Gecentreerde kaart zonder navigatie voor inloggen, code en wachtwoord (spec 08 §4.5). */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="inhoud" tabIndex={-1} className="flex min-h-dvh flex-col items-center bg-ice pt-[max(2.5rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(2.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] focus:outline-none sm:justify-center sm:py-16">
      <div className="grid w-full max-w-sm gap-6">
        <p className="flex items-center justify-center gap-2">
          <Logo title={S.app.name} />
          <span className="rounded-md bg-brand-tint px-2 py-0.5 text-sm font-semibold text-brand-strong">{S.app.short}</span>
        </p>
        {children}
      </div>
    </main>
  );
}
