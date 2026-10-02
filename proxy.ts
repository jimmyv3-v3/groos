import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE_COUNTRIES, routing } from "./i18n/routing";
import { hasSupabaseEnv } from "./lib/supabase/env";
import { updateSession } from "./lib/supabase/proxy";

// Next.js 16 noemt middleware "proxy" (proxy.ts, draait op Node.js). Twee
// taken: taalrouting voor de publieke site (spec 01 §4.12) en sessieverversing
// voor /beheer (spec 08 §4.13, spec 10 §4.2). /beheer gaat nooit door de
// taalrouting, de geo-redirect of de NEXT_LOCALE-cookie.
const intlMiddleware = createMiddleware(routing);

const COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

// De tweede taal, als die er is. Op een eentalige site valt de geo-logica weg.
const SECONDARY = routing.locales.find((l) => l !== routing.defaultLocale);

// Crawlers, link-previews en testtools krijgen nooit een geo-omleiding.
// "google" vangt ook Google-InspectionTool (Rich Results Test) en Google-Extended.
const BOT_UA =
  /bot|crawl|spider|slurp|google|bing|duckduck|yandex|baidu|applebot|facebookexternalhit|whatsapp|linkedin|telegram|slack|discord|embedly|preview|lighthouse|inspectiontool|headless|vercel/i;

function toSecondary(request: NextRequest, locale: string) {
  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;
  url.pathname = `/${locale}${path === "/" ? "" : path}`;
  return url;
}

/**
 * /beheer: ververs de Supabase-sessie (Server Components kunnen geen cookies
 * schrijven). De toegangsregels (inloggen, MFA) voegt spec 08 toe in
 * app/beheer/_lib/proxy.ts; tot dan alleen verversen en noindex.
 */
async function beheer(request: NextRequest): Promise<NextResponse> {
  const response = hasSupabaseEnv() ? (await updateSession(request)).response : NextResponse.next({ request });
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/beheer" || pathname.startsWith("/beheer/")) return beheer(request);

  if (!SECONDARY) return intlMiddleware(request);

  const isSecondaryPath = pathname === `/${SECONDARY}` || pathname.startsWith(`/${SECONDARY}/`);
  const cookie = request.cookies.get(COOKIE)?.value;
  const isBot = BOT_UA.test(request.headers.get("user-agent") ?? "");

  // Terugkerende bezoeker die eerder de tweede taal koos: houd hem daar.
  if (cookie === SECONDARY && !isSecondaryPath) {
    return NextResponse.redirect(toSecondary(request, SECONDARY));
  }

  // Eerste bezoek op een pad in de standaardtaal: bepaal de taal op basis van
  // het land uit het IP-adres (Vercel-header). Buiten NL en BE: tweede taal.
  if (!cookie && !isSecondaryPath && !isBot) {
    const country = request.headers.get("x-vercel-ip-country");
    if (country && !DEFAULT_LOCALE_COUNTRIES.includes(country)) {
      const response = NextResponse.redirect(toSecondary(request, SECONDARY));
      response.cookies.set(COOKIE, SECONDARY, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Eerste regel: publieke site. Overslaan: API-routes, beheer, feeds,
  // monitoring, Next-interne paden, gegenereerde metadata-routes en alles met
  // een punt (bestanden, sitemap.xml, robots.txt, llms.txt, .well-known).
  // Tweede regel: /beheer, alleen voor sessieverversing (geen taalrouting).
  matcher: [
    "/((?!api|beheer|feeds|monitoring|_next|_vercel|opengraph-image|twitter-image|icon|apple-icon|.*\\..*).*)",
    "/beheer/:path*",
  ],
};
