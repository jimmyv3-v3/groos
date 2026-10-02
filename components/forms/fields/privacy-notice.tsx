/** Vaste informatieregel direct boven de verzendknop (spec 07 §4.3, spec 09 §4.8). */
export function PrivacyNotice({ text }: { text: React.ReactNode }) {
  return (
    <p className="max-w-prose text-sm text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-brand-strong">
      {text}
    </p>
  );
}
