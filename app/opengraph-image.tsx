import { ImageResponse } from "next/og";
import nl from "@/messages/nl.json";
import { brand } from "@/lib/brand";
import { contact } from "@/lib/site";

export const alt = contact.shortName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph-afbeelding voor gedeelde links (WhatsApp, LinkedIn, Google).
 * Kleuren uit lib/brand.ts, tekst uit messages `meta.og*`. Wordt via
 * pageMetadata() op elke pagina gelinkt en staat buiten de taal-proxy.
 * TODO (design): logo toevoegen en de opmaak afstemmen op de nieuwe identiteit.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background: brand.colors.background,
          color: brand.colors.foreground,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            color: brand.colors.muted,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {contact.shortName}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 600,
            maxWidth: 960,
            color: brand.colors.accent,
          }}
        >
          {nl.meta.ogHeadline}
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: brand.colors.muted }}>
          {nl.meta.ogSubline}
        </div>
      </div>
    ),
    { ...size },
  );
}
