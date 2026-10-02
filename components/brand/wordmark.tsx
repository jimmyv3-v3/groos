import { Logo } from "./logo";

/**
 * Compatibiliteitswrapper rond Logo (spec 02 §4.11). Standaard zonder
 * beschrijver (header); de footer zet showDescriptor. Decoratief: de link
 * eromheen draagt de toegankelijke naam.
 */
export function Wordmark({
  className,
  showDescriptor = false,
}: {
  className?: string;
  idSuffix?: string;
  showDescriptor?: boolean;
}) {
  return <Logo variant={showDescriptor ? "lockup" : "wordmark"} decorative className={className} />;
}
