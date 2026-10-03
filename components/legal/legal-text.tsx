import { Fragment } from "react";
import { Link } from "@/i18n/navigation";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const LINK_CLASS = "text-brand-strong underline underline-offset-4 hover:text-brand";

/**
 * Juridische tekst met links in de notatie [label](href) (spec 09 §4.3).
 * "/…" wordt een locale-bewuste Link; "#", "mailto:", "tel:" en "https:" een
 * gewone <a> in hetzelfde tabblad. Geen HTML in strings; React escapet de rest.
 */
export function LegalText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    if (href.startsWith("/")) {
      parts.push(
        <Link key={start} href={href} className={LINK_CLASS}>
          {label}
        </Link>,
      );
    } else {
      const external = href.startsWith("https:");
      parts.push(
        <a key={start} href={href} className={LINK_CLASS} rel={external ? "noopener noreferrer" : undefined}>
          {label}
        </a>,
      );
    }
    last = start + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts.map((part, i) => (typeof part === "string" ? <Fragment key={`t${i}`}>{part}</Fragment> : part))}</>;
}
