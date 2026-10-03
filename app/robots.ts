import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Spec 12 §4.8. Filterpagina's, bedankpagina's en gesloten vacatures worden
// niet geblokkeerd: Google moet hun noindex kunnen lezen.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/beheer", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
