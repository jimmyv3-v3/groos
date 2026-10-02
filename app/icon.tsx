import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Tijdelijk favicon met de initialen uit lib/brand.ts. TODO (design): vervang
 * door het echte beeldmerk door app/icon.png (512×512) toe te voegen en dit
 * bestand te verwijderen; laat nooit beide naast elkaar staan.
 */
export default function Icon() {
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
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1,
          borderRadius: 12,
          fontFamily: "sans-serif",
        }}
      >
        {brand.initials}
      </div>
    ),
    { ...size },
  );
}
