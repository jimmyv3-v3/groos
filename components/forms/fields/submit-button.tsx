import { CtaButton } from "@/components/ui/cta-button";

/** Verzendknop; de spinner en de status komen uit CtaButton (spec 07 §4.3). */
export function SubmitButton({ label, pendingLabel, pending }: { label: string; pendingLabel: string; pending: boolean }) {
  return (
    <>
      <CtaButton type="submit" size="lg" pending={pending} pendingLabel={pendingLabel} className="w-full sm:w-auto">
        {label}
      </CtaButton>
      <span role="status" className="sr-only">
        {pending ? pendingLabel : ""}
      </span>
    </>
  );
}
