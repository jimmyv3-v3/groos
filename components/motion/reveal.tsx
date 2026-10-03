import type { CSSProperties, ReactNode } from "react";

/**
 * Reveal zonder JavaScript (spec 02 §4.10): een server component dat de klasse
 * .reveal zet; de animatie is scroll-gedreven CSS (animation-timeline: view(),
 * zie app/globals.css). Zonder ondersteuning, zonder JavaScript of met reduced
 * motion staat de inhoud direct zichtbaar. Nooit gebruiken voor de h1, de
 * eerste alinea of iets boven de vouw op 390 px.
 *
 * De props blijven gelijk aan de vorige framer-motion-versie; scale, delay,
 * stagger en delayChildren worden genegeerd (volgorde komt uit :nth-child).
 */
type RevealTag = "div" | "section" | "li" | "span" | "h2" | "p";

function revealStyle(y: number): CSSProperties {
  return { "--reveal-y": `${y}px` } as CSSProperties;
}

export function Reveal({
  children,
  y = 12,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
  className?: string;
  as?: RevealTag;
}) {
  return (
    <Tag data-reveal="" className={className ? `reveal ${className}` : "reveal"} style={revealStyle(y)}>
      {children}
    </Tag>
  );
}

/** Groep: kinderen met <RevealItem> komen na elkaar in beeld. */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return <div className={className ? `reveal-group ${className}` : "reveal-group"}>{children}</div>;
}

export function RevealItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  return (
    <Tag data-reveal="" className={className ? `reveal ${className}` : "reveal"} style={revealStyle(12)}>
      {children}
    </Tag>
  );
}
