import { LogoMark } from "./logo-mark";

/** Compatibiliteitswrapper rond LogoMark (de losse "oo"), spec 02 §4.11. */
export function Monogram({
  className,
  title,
}: {
  className?: string;
  idSuffix?: string;
  title?: string;
}) {
  return <LogoMark variant="oo" className={className} title={title} />;
}
