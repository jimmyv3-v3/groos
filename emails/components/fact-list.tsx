import { Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { emailTheme as t } from "../theme";
import { EmailSubheading } from "./email-text";

export type Fact = { label: string; value: ReactNode };

/** Feitenlijst op een lichtblauw vlak, zonder tabellen (spec 11 §4.13). */
export function FactList({ title, facts }: { title?: string; facts: Fact[] }) {
  return (
    <>
      {title && <EmailSubheading>{title}</EmailSubheading>}
      <Section style={{ backgroundColor: t.color.tint, borderRadius: 8, padding: 16, margin: "0 0 16px" }}>
        {facts.map((fact) => (
          <Text
            key={fact.label}
            style={{ margin: "0 0 6px", fontSize: t.size.body, lineHeight: t.lineHeight.body, color: t.color.text }}
          >
            <strong>{fact.label}:</strong> {fact.value}
          </Text>
        ))}
      </Section>
    </>
  );
}
