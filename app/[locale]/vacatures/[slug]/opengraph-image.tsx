import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { brand } from "@/lib/brand";
import { contact, site } from "@/lib/site";
import { OG_SIZE } from "@/lib/seo";
import { getVacancyByNumber } from "@/lib/data/vacancies";
import { parseVacancySlug } from "@/lib/data/vacancy-search-params";
import { wordmarkDataUri, wordmarkRatio } from "@/components/brand/logo-svg";
import { getVacancyMetaValues } from "@/components/vacatures/vacancy-format";
import nlVacatures from "@/messages/nl/vacatures.json";
import SiteOgImage from "@/app/opengraph-image";

/**
 * OG-afbeelding per vacature (spec 12 §4.6, inhoud spec 06 §7.6): label,
 * titel, plaats, uren en uurloon; gesloten: "Deze vacature is gesloten".
 * Onbekend nummer: de site-brede kaart. Opmaak volgt OgCard van spec 12;
 * zodra lib/og.tsx (renderOgCard) bestaat, kan deze route daarop overgaan.
 */
export const revalidate = 3600;
export const alt = `${nlVacatures.og.label}, ${contact.shortName}`;
export const size = OG_SIZE;
export const contentType = "image/png";

const fontsPromise = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/InstrumentSans-SemiBold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Onest-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Onest-Medium.ttf")),
]);

const FOOTER = new URL(site.url).hostname.replace(/^www\./, "");

function titleSize(title: string): number {
  if (title.length <= 28) return 76;
  if (title.length <= 44) return 64;
  return 56;
}

export default async function VacancyOgImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale: Locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const number = parseVacancySlug(slug);
  const vacancy = number ? await getVacancyByNumber(number) : null;
  if (!vacancy) return SiteOgImage();

  const [t, values, [instrumentSemiBold, onestRegular, onestMedium]] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.og" }),
    getVacancyMetaValues(vacancy, locale),
    fontsPromise,
  ]);
  const closed = vacancy.state === "closed";
  const title = vacancy.title.length > 90 ? `${vacancy.title.slice(0, 89)}…` : vacancy.title;
  const lines = closed ? [values.city] : [values.city, values.hours];
  const highlight = closed ? t("closed") : values.wage;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: brand.colors.background }}>
        <div style={{ width: 12, height: "100%", background: brand.colors.accent }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 72,
            color: brand.colors.foreground,
          }}
        >
          <img src={wordmarkDataUri()} height={48} width={Math.round(48 * wordmarkRatio)} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Onest", fontWeight: 500, fontSize: 28, color: brand.colors.accent }}>
              {t("label")}
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: "Instrument Sans",
                fontWeight: 600,
                fontSize: titleSize(title),
                lineHeight: 1.1,
                letterSpacing: -1,
                lineClamp: 3,
                maxWidth: 1000,
              }}
            >
              {title}
            </div>
            {lines.map((line) => (
              <div
                key={line}
                style={{ marginTop: 12, fontFamily: "Onest", fontWeight: 400, fontSize: 34, color: brand.colors.muted }}
              >
                {line}
              </div>
            ))}
            <div style={{ display: "flex", marginTop: 24 }}>
              <div
                style={{
                  display: "flex",
                  padding: "10px 24px",
                  borderRadius: 999,
                  background: brand.colors.brandTint,
                  color: brand.colors.accent,
                  fontFamily: "Onest",
                  fontWeight: 500,
                  fontSize: 34,
                }}
              >
                {highlight}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontFamily: "Onest",
              fontWeight: 400,
              fontSize: 26,
              color: brand.colors.accent,
            }}
          >
            {FOOTER}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Instrument Sans", data: instrumentSemiBold, style: "normal", weight: 600 },
        { name: "Onest", data: onestRegular, style: "normal", weight: 400 },
        { name: "Onest", data: onestMedium, style: "normal", weight: 500 },
      ],
    },
  );
}
