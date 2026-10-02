import { brand } from "@/lib/brand";
import { S } from "../_strings";

export const dynamic = "force-static";

/** Webmanifest zodat Groos Beheer als app op het beginscherm kan (spec 08 §4.12). */
export function GET() {
  const manifest = {
    id: "/beheer",
    name: S.app.name,
    short_name: S.app.name,
    lang: "nl",
    start_url: "/beheer",
    scope: "/beheer/",
    display: "standalone",
    background_color: brand.colors.background,
    theme_color: brand.colors.background,
    icons: [
      { src: "/beheer/icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/beheer/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
