import { Alert } from "@/components/ui/alert";

/** Samenvatting bovenaan het formulier, alleen bij status invalid (spec 07 §4.3). */
export function ErrorSummary({ count, text }: { count: number; text: string }) {
  if (count === 0) return null;
  return (
    <Alert tone="danger" role="alert">
      {text}
    </Alert>
  );
}
