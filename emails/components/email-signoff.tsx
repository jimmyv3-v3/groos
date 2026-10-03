import { Link, Text } from "@react-email/components";
import type { EmailCompany, EmailLocale } from "../types";
import { emailTheme as t } from "../theme";

const COPY = {
  nl: {
    greeting: "Met vriendelijke groet,",
    team: "Het team van Groos Personeelsdiensten",
    heading: "Kom in contact met ons team",
    call: "Bel of app ons op",
    mail: "of mail naar",
    whatsapp: "WhatsApp",
  },
  en: {
    greeting: "Kind regards,",
    team: "The team of Groos Personeelsdiensten",
    heading: "Get in touch with our team",
    call: "Call or message us on",
    mail: "or email",
    whatsapp: "WhatsApp",
  },
} as const;

const link = { color: t.color.text, textDecoration: "underline" } as const;

/**
 * Groet en teamblok onder bevestigingen (spec 11 §6.9, B-60): geen
 * persoonsnamen, wel het ene nummer, WhatsApp en e-mail.
 */
export function EmailSignoff({ locale, company }: { locale: EmailLocale; company: EmailCompany }) {
  const c = COPY[locale];
  const body = { fontSize: t.size.body, lineHeight: t.lineHeight.body, color: t.color.text } as const;
  const whatsappHref = `https://wa.me/${company.phoneHref.replace(/^tel:\+?/, "")}`;
  return (
    <>
      <Text style={{ ...body, margin: "24px 0 8px" }}>
        {c.greeting}
        <br />
        {c.team}
      </Text>
      <Text style={{ ...body, margin: "0 0 8px" }}>
        <strong>{c.heading}</strong>
        <br />
        {c.call}{" "}
        <Link href={company.phoneHref} style={link}>
          {company.phoneDisplay}
        </Link>{" "}
        (
        <Link href={whatsappHref} style={link}>
          {c.whatsapp}
        </Link>
        ) {c.mail}{" "}
        <Link href={`mailto:${company.email}`} style={link}>
          {company.email}
        </Link>
        .
      </Text>
    </>
  );
}
