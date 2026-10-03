import { Button, Heading, Link, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { emailTheme as t } from "../theme";

/** Tekstbouwstenen van de mails (spec 11 §4.13). Alleen inline stijlen. */

export function EmailText({
  children,
  muted = false,
  size = "body",
}: {
  children: ReactNode;
  muted?: boolean;
  size?: "body" | "small";
}) {
  return (
    <Text
      style={{
        margin: "0 0 16px",
        fontSize: size === "small" ? t.size.small : t.size.body,
        lineHeight: t.lineHeight.body,
        color: muted ? t.color.muted : t.color.text,
      }}
    >
      {children}
    </Text>
  );
}

export function EmailSubheading({ children }: { children: ReactNode }) {
  return (
    <Heading
      as="h2"
      style={{
        margin: "24px 0 8px",
        fontSize: t.size.h2,
        lineHeight: t.lineHeight.heading,
        fontWeight: 600,
        color: t.color.text,
      }}
    >
      {children}
    </Heading>
  );
}

export function EmailLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} style={{ color: t.color.brand, textDecoration: "underline" }}>
      {children}
    </Link>
  );
}

/** Knop; staat altijd naast informatie die ook zonder knop werkt. */
export function EmailButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: t.color.brand,
        color: t.color.onBrand,
        fontSize: t.size.body,
        fontWeight: 600,
        padding: "13px 22px",
        borderRadius: 999,
        margin: "8px 0 24px",
        textDecoration: "none",
        display: "inline-block",
      }}
    >
      {children}
    </Button>
  );
}

/** Zet het eerste voorkomen van `word` in `text` als link. */
export function withLink(text: string, word: string, href: string): ReactNode {
  const index = text.indexOf(word);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <EmailLink href={href}>{word}</EmailLink>
      {text.slice(index + word.length)}
    </>
  );
}
