import { ImageResponse } from "next/og";
import { tileDataUri } from "@/components/brand/logo-svg";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: kobalt tegel (hoekstraal 12/48) met het witte beeldmerk (spec 02 §4.11). */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <img src={tileDataUri()} width={64} height={64} alt="" />
      </div>
    ),
    { ...size },
  );
}
