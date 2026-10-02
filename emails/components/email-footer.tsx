import { Link, Section, Text } from "@react-email/components";
import type { EmailCompany, EmailLocale } from "../types";
import { emailTheme as t } from "../theme";
import { fill } from "./fill";

const COPY = {
  nl: {
    address: "{street}, {postalCode} {city}. Langskomen kan alleen op afspraak.",
    phone: "Telefoon",
    email: "E-mail",
    kvk: "KvK-nummer {kvk}",
    officeHours: "Kantoortijden: {officeHours}",
  },
  en: {
    address: "{street}, {postalCode} {city}. Visits are by appointment only.",
    phone: "Phone",
    email: "Email",
    kvk: "Chamber of Commerce (KvK) number {kvk}",
    officeHours: "Office hours: {officeHours}",
  },
} as const;

const line = { margin: "0 0 4px", fontSize: t.size.small, lineHeight: 1.5, color: t.color.muted } as const;
const link = { color: t.color.muted, textDecoration: "underline" } as const;

/** Voettekst met NAW, contactregel en notitie (spec 11 §4.13, §6.9). */
export function EmailFooter({ locale, company, note }: { locale: EmailLocale; company: EmailCompany; note: string }) {
  const c = COPY[locale];
  return (
    <Section>
      <Text style={line}>{company.legalName}</Text>
      <Text style={line}>{fill(c.address, company)}</Text>
      <Text style={line}>
        {c.phone}{" "}
        <Link href={company.phoneHref} style={link}>
          {company.phoneDisplay}
        </Link>
        {" · "}
        {c.email}{" "}
        <Link href={`mailto:${company.email}`} style={link}>
          {company.email}
        </Link>
        {" · "}
        <Link href={company.websiteUrl} style={link}>
          {company.websiteLabel}
        </Link>
      </Text>
      {company.kvk && <Text style={line}>{fill(c.kvk, { kvk: company.kvk })}</Text>}
      {company.officeHours && <Text style={line}>{fill(c.officeHours, { officeHours: company.officeHours })}</Text>}
      <Text style={{ ...line, marginTop: 12 }}>{note}</Text>
    </Section>
  );
}
