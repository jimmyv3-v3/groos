import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import nl from "@/messages/nl.json";
import { brand } from "@/lib/brand";
import { contact } from "@/lib/site";
import { markDataUri, wordmarkDataUri, wordmarkRatio } from "@/components/brand/logo-svg";

export const alt = contact.shortName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Statische TTF's (OFL) uit assets/fonts, spec 02 §4.12.
const [instrumentSemiBold, onestRegular, onestMedium] = await Promise.all([
  readFile(join(process.cwd(), "assets/fonts/InstrumentSans-SemiBold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Onest-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Onest-Medium.ttf")),
]);

const DOMAIN = "groospersoneelsdiensten.nl";

/**
 * Open Graph-afbeelding (opmaak spec 02 §4.12; spec 12 is eigenaar en vult de
 * tekst in messages `meta.og*`). Wit vlak met woordmerk, kop, subregel en
 * domein; rechts een ijsblauw vlak met de losse "oo".
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: brand.colors.background,
          color: brand.colors.foreground,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 80,
          }}
        >
          <img src={wordmarkDataUri()} height={48} width={Math.round(48 * wordmarkRatio)} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Instrument Sans",
                fontWeight: 600,
                fontSize: 64,
                lineHeight: 1.08,
                letterSpacing: -1.2,
                maxWidth: 720,
                lineClamp: 3,
              }}
            >
              {nl.meta.ogHeadline}
            </div>
            <div
              style={{
                marginTop: 24,
                fontFamily: "Onest",
                fontWeight: 400,
                fontSize: 28,
                lineHeight: 1.4,
                maxWidth: 680,
                color: brand.colors.muted,
              }}
            >
              {nl.meta.ogSubline}
            </div>
          </div>
          <div style={{ fontFamily: "Onest", fontWeight: 500, fontSize: 24, color: brand.colors.brand }}>
            {DOMAIN}
          </div>
        </div>
        <div
          style={{
            width: 340,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: brand.colors.brandTint,
          }}
        >
          <img src={markDataUri()} width={220} height={220} alt="" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Sans", data: instrumentSemiBold, style: "normal", weight: 600 },
        { name: "Onest", data: onestRegular, style: "normal", weight: 400 },
        { name: "Onest", data: onestMedium, style: "normal", weight: 500 },
      ],
    },
  );
}
