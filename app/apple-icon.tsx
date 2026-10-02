import { ImageResponse } from "next/og";
import { tileDataUri } from "@/components/brand/logo-svg";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple-touch-icon: volle kobalt vierkant zonder hoekstraal (iOS rondt zelf af)
 * met de witte "oo" op ongeveer 70 % van de breedte (spec 02 §4.11).
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <img src={tileDataUri({ rounded: false })} width={180} height={180} alt="" />
      </div>
    ),
    { ...size },
  );
}
