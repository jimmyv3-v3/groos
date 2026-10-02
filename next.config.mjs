import createNextIntlPlugin from "next-intl/plugin";
import { withBotId } from "botid/next/config";

const withNextIntl = createNextIntlPlugin();
const isDev = process.env.NODE_ENV === "development";
// upgrade-insecure-requests alleen op Vercel; lokaal draait `next start` op http.
const onVercel = process.env.VERCEL === "1";

// Herkomst van het Supabase-project van deze omgeving (dev, preview of
// productie). Nodig voor de cv-upload vanuit de browser (signed upload URL),
// de Supabase-client in /beheer en beelden uit de bucket public-media.
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
  : null;
const supabaseSrc = supabaseOrigin ? ` ${supabaseOrigin}` : "";

// CSP zonder nonce (spec 13 §4.2): een nonce dwingt dynamische rendering af
// voor elke pagina (zie de Next.js-gids content-security-policy). De site leunt
// op statische pagina's en unstable_cache (B-35), dus 'unsafe-inline' voor scripts.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${supabaseSrc}`,
  "font-src 'self'",
  `connect-src 'self'${supabaseSrc}${isDev ? " ws://localhost:* https://va.vercel-scripts.com" : ""}`,
  "frame-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(!isDev && onVercel ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root so Next doesn't latch onto a stray lockfile elsewhere.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseOrigin
      ? [new URL(`${supabaseOrigin}/storage/v1/object/public/public-media/**`)]
      : [],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // app/global-not-found.tsx: 404 voor URL's buiten de taalproxy (spec 01 §4.13).
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/beheer/:path*", headers: noindex },
      { source: "/api/:path*", headers: noindex },
    ];
  },
  // Groos had geen eerdere site; voeg hier 308-regels toe als URL's later
  // veranderen, bijvoorbeeld
  // { source: "/oude-pagina", destination: "/nieuwe-pagina", permanent: true }.
  // Kaal domein naar www regelt Vercel (spec 13 Deel E), niet deze lijst.
  async redirects() {
    return [];
  },
};

// withBotId als buitenste laag. BotID voegt eigen rewrites en headers toe voor
// zijn eigen pad; die komen na de onze en winnen daar (bij gelijke sleutel telt
// de laatste, zie de Next.js-docs over headers).
export default withBotId(withNextIntl(nextConfig));
