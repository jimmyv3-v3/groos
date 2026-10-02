import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so Next doesn't latch onto a stray lockfile elsewhere.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // 301-redirects voor oude URL's, zodat SEO-waarde en bestaande links blijven
  // werken. J. Versseput stuurde hier de oude Wix-pagina's door. Groos heeft
  // nog geen oude site; voeg regels toe als URL's later veranderen, bijvoorbeeld
  // { source: "/oude-pagina", destination: "/nieuwe-pagina", permanent: true }.
  async redirects() {
    return [];
  },
};

export default withNextIntl(nextConfig);
