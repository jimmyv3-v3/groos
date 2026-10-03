import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section } from "@react-email/components";
import type { ReactNode } from "react";
import type { EmailCompany, EmailLocale } from "../types";
import { emailTheme as t } from "../theme";
import { EmailFooter } from "./email-footer";

/**
 * Raamwerk van elke mail (spec 11 §4.13): witte kaart op ijsblauw, een balk
 * van 4 px in kobalt, logo, h1, inhoud en voettekst.
 */
export function EmailLayout({
  locale,
  preview,
  heading,
  company,
  footerNote,
  children,
}: {
  locale: EmailLocale;
  preview: string;
  heading: string;
  company: EmailCompany;
  footerNote: string;
  children: ReactNode;
}) {
  return (
    <Html lang={locale} dir="ltr">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: "24px 0", backgroundColor: t.color.page, fontFamily: t.font, color: t.color.text }}>
        <Container
          style={{
            maxWidth: t.width,
            width: "100%",
            backgroundColor: t.color.card,
            border: `1px solid ${t.color.border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Section style={{ height: 4, backgroundColor: t.color.brand, fontSize: 0, lineHeight: 0 }}>&nbsp;</Section>
          <Section style={{ padding: "32px 24px 8px" }}>
            <Img src={company.logoUrl} width={160} height={67} alt={company.legalName} style={{ margin: "0 0 24px" }} />
            <Heading
              as="h1"
              style={{
                margin: "0 0 16px",
                fontSize: t.size.h1,
                lineHeight: t.lineHeight.heading,
                fontWeight: 600,
                color: t.color.text,
              }}
            >
              {heading}
            </Heading>
            {children}
          </Section>
          <Section style={{ padding: "0 24px 24px" }}>
            <Hr style={{ borderColor: t.color.border, margin: "8px 0 16px" }} />
            <EmailFooter locale={locale} company={company} note={footerNote} />
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
