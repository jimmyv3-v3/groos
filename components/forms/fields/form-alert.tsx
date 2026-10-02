import { Alert } from "@/components/ui/alert";

/** Globale fout boven de verzendknop, met bellen en WhatsApp eronder (spec 07 §4.3). */
export function FormAlert({
  message,
  showContact = true,
  contactLinks,
}: {
  message: string;
  showContact?: boolean;
  contactLinks?: React.ReactNode;
}) {
  return (
    <Alert tone="danger" role="alert">
      <p>{message}</p>
      {showContact && contactLinks && <div className="mt-3 flex flex-wrap gap-2">{contactLinks}</div>}
    </Alert>
  );
}
