import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";
import { markDataUri, markRatio } from "@/components/brand/logo-svg";

/** App-iconen 192 en 512: het beeldmerk wit op kobalt met 20 procent witruimte (maskable, spec 08 §4.12). */
export function generateImageMetadata() {
  return [
    { id: "192", contentType: "image/png", size: { width: 192, height: 192 } },
    { id: "512", contentType: "image/png", size: { width: 512, height: 512 } },
  ];
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id) === 512 ? 512 : 192;
  const inner = Math.round(size * 0.6);
  const white = brand.colors.background;
  const src = markDataUri({ g: white, crescent: white });
  const markWidth = markRatio >= 1 ? inner : Math.round(inner * markRatio);
  const markHeight = markRatio >= 1 ? Math.round(inner / markRatio) : inner;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: brand.colors.brand,
        }}
      >
        <img src={src} width={markWidth} height={markHeight} alt="" />
      </div>
    ),
    { width: size, height: size },
  );
}
