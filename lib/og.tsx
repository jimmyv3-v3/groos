import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";
import { OG_SIZE } from "@/lib/seo";
import { site } from "@/lib/site";
import { logoDataUri, logoRatio } from "@/components/brand/logo-svg";

/**
 * Gedeelde opmaak, fonts en kleuren voor alle OG-afbeeldingen (spec 12 §4.6).
 * Alleen server, Node-runtime. Routes: app/opengraph-image.tsx, de vacature-
 * en de beroepsroutes onder app/[locale].
 */

export const OG_CONTENT_TYPE = "image/png";
export { OG_SIZE, logoDataUri };

/** Kleurrollen voor de OG-afbeeldingen; waarden komen uit lib/brand.ts (spec 02), nooit hex hier. */
export const OG_COLORS = {
  canvas: brand.colors.background,
  ink: brand.colors.foreground,
  muted: brand.colors.muted,
  accent: brand.colors.accent,
  accentSoft: brand.colors.brandTint,
  onAccent: brand.colors.background,
} as const;

type OgFonts = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"];

// Eén keer per proces gelezen (modulescope), zoals opengraph-image.md voorschrijft
// ("Using Node.js runtime with local assets"); Next neemt de bestanden mee in de bundel.
const fontsPromise = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/InstrumentSans-SemiBold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Onest-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Onest-Medium.ttf")),
]);

/** De drie statische TTF's van spec 02: Instrument Sans 600, Onest 400 en Onest 500. */
export async function loadOgFonts(): Promise<OgFonts> {
  const [instrumentSemiBold, onestRegular, onestMedium] = await fontsPromise;
  return [
    { name: "Instrument Sans", data: instrumentSemiBold, style: "normal", weight: 600 },
    { name: "Onest", data: onestRegular, style: "normal", weight: 400 },
    { name: "Onest", data: onestMedium, style: "normal", weight: 500 },
  ];
}

export type OgCardProps = {
  /** Klein label boven de kop, bijvoorbeeld "Vacature" of "Werkgevers". Geen hoofdletters. */
  label?: string;
  title: string;
  /** Hoogstens twee korte regels onder de kop. */
  lines?: string[];
  /** Eén regel in de accentkleur, bijvoorbeeld het uurloon. */
  highlight?: string;
  /** Rechtsonder, standaard de hostnaam van site.url zonder "www.". */
  footer?: string;
};

const DEFAULT_FOOTER = new URL(site.url).hostname.replace(/^www\./, "");
const TITLE_MAX = 90;
const LOGO_HEIGHT = 48;

function fitTitle(title: string): string {
  return title.length > TITLE_MAX ? `${title.slice(0, TITLE_MAX - 1).trimEnd()}…` : title;
}

function titleSize(title: string): number {
  if (title.length <= 28) return 76;
  if (title.length <= 44) return 64;
  return 56;
}

/** Rendert de kaart als ImageResponse van 1200 bij 630. */
export async function renderOgCard({
  label,
  title,
  lines = [],
  highlight,
  footer = DEFAULT_FOOTER,
}: OgCardProps): Promise<ImageResponse> {
  const fonts = await loadOgFonts();
  const heading = fitTitle(title);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: OG_COLORS.canvas }}>
        <div style={{ width: 12, height: "100%", background: OG_COLORS.accent }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 72,
            color: OG_COLORS.ink,
          }}
        >
          {/* ImageResponse (Satori) kent alleen <img>, geen next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUri()}
            height={LOGO_HEIGHT}
            width={Math.round(LOGO_HEIGHT * logoRatio)}
            alt=""
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {label && (
              <div style={{ fontFamily: "Onest", fontWeight: 500, fontSize: 28, color: OG_COLORS.accent }}>
                {label}
              </div>
            )}
            <div
              style={{
                marginTop: label ? 12 : 0,
                fontFamily: "Instrument Sans",
                fontWeight: 600,
                fontSize: titleSize(heading),
                lineHeight: 1.1,
                letterSpacing: -1,
                lineClamp: 3,
                maxWidth: 1000,
              }}
            >
              {heading}
            </div>
            {lines.slice(0, 2).map((line) => (
              <div
                key={line}
                style={{ marginTop: 12, fontFamily: "Onest", fontWeight: 400, fontSize: 34, color: OG_COLORS.muted }}
              >
                {line}
              </div>
            ))}
            {highlight && (
              <div style={{ display: "flex", marginTop: 24 }}>
                <div
                  style={{
                    display: "flex",
                    padding: "10px 24px",
                    borderRadius: 999,
                    background: OG_COLORS.accentSoft,
                    color: OG_COLORS.accent,
                    fontFamily: "Onest",
                    fontWeight: 500,
                    fontSize: 34,
                  }}
                >
                  {highlight}
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontFamily: "Onest",
              fontWeight: 400,
              fontSize: 26,
              color: OG_COLORS.accent,
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
