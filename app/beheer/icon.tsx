import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";
import paths from "@/components/brand/logo-paths.json";

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
  const [, , w, h] = paths.mark.viewBox.split(" ").map(Number);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.mark.viewBox}"><path transform="${paths.mark.transform}" d="${paths.mark.oo}" fill="${brand.colors.background}"/></svg>`;
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  const markWidth = w >= h ? inner : Math.round((inner * w) / h);
  const markHeight = w >= h ? Math.round((inner * h) / w) : inner;
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
