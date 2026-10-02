import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Tijdelijke apple-touch-icon met de initialen. TODO (design): vervang door
 * app/apple-icon.png (180×180) en verwijder dit bestand.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.colors.accent,
          color: brand.colors.background,
          fontSize: 80,
          fontWeight: 700,
          letterSpacing: -2,
          fontFamily: "sans-serif",
        }}
      >
        {brand.initials}
      </div>
    ),
    { ...size },
  );
}
