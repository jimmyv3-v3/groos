import { LogoMark } from "./logo-mark";

/** Compatibiliteitswrapper rond LogoMark (het losse beeldmerk), spec 02 §4.11. */
export function Monogram({
  className,
  title,
}: {
  className?: string;
  idSuffix?: string;
  title?: string;
}) {
  return <LogoMark variant="mark" className={className} title={title} />;
}
