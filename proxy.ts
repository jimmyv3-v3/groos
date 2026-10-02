import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE_COUNTRIES, routing } from "./i18n/routing";
import { beheerProxy } from "./app/beheer/_lib/proxy";
import { NOT_FOUND_HEADER, NOT_FOUND_PATH, isKnownPath } from "./lib/routes";

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
 * Onbekend pad: herschrijf met status 404 naar het vangnet [...rest], dat de
 * gelokaliseerde 404 op de server rendert (spec 01 §4.13). notFound() zou in
 * Next 16.3 alleen een lege HTML-schil geven. Omleidingen van next-intl
 * (bijvoorbeeld /nl/x naar /x) gaan voor.
 */
function withNotFound(request: NextRequest, response: NextResponse): NextResponse {
  const { pathname } = request.nextUrl;
  if ((response.status >= 300 && response.status < 400) || isKnownPath(pathname)) return response;

  const locale = SECONDARY && (pathname === `/${SECONDARY}` || pathname.startsWith(`/${SECONDARY}/`))
    ? SECONDARY
    : routing.defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${NOT_FOUND_PATH}`;
  const headers = new Headers(request.headers);
  headers.set(NOT_FOUND_HEADER, "1");
  const rewrite = NextResponse.rewrite(url, { status: 404, request: { headers } });
  for (const cookie of response.headers.getSetCookie()) rewrite.headers.append("set-cookie", cookie);
  return rewrite;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // /beheer: sessieverversing, noindex en optimistische toegangsregels (spec 08 §4.13).
  if (pathname === "/beheer" || pathname.startsWith("/beheer/")) return beheerProxy(request);

  if (!SECONDARY) return withNotFound(request, intlMiddleware(request));

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

  return withNotFound(request, intlMiddleware(request));
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
