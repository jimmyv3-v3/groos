import { Text } from "@react-email/components";
import type { EmailLocale } from "../types";
import { emailTheme as t } from "../theme";

const COPY = {
  nl: { greeting: "Met vriendelijke groet,", names: "Jimmy en Lorenzo", company: "Groos Personeelsdiensten" },
  en: { greeting: "Kind regards,", names: "Jimmy and Lorenzo", company: "Groos Personeelsdiensten" },
} as const;

/** Groet onder bevestigingen (spec 11 §6.9). */
export function EmailSignoff({ locale }: { locale: EmailLocale }) {
  const c = COPY[locale];
  return (
    <Text style={{ margin: "24px 0 8px", fontSize: t.size.body, lineHeight: t.lineHeight.body, color: t.color.text }}>
      {c.greeting}
      <br />
      {c.names}
      <br />
      {c.company}
    </Text>
  );
}
