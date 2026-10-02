import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE_COUNTRIES, routing } from "./i18n/routing";

// Next.js 16 noemt middleware "proxy" (proxy.ts, draait op Node.js).
const intlMiddleware = createMiddleware(routing);

const COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

// De tweede taal, als die er is. Op een eentalige site valt de geo-logica weg.
const SECONDARY = routing.locales.find((l) => l !== routing.defaultLocale);

// Crawlers en link-previews krijgen nooit een geo-redirect. Googlebot crawlt
// grotendeels vanuit de VS en zou anders elke Nederlandse URL alleen als
// redirect naar /en zien, waardoor de Nederlandse pagina's slecht indexeren.
const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|linkedin|embedly|preview|lighthouse/i;

function toSecondary(request: NextRequest, locale: string) {
  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;
  url.pathname = `/${locale}${path === "/" ? "" : path}`;
  return url;
}

export default function proxy(request: NextRequest) {
  if (!SECONDARY) return intlMiddleware(request);

  const { pathname } = request.nextUrl;
  const isSecondaryPath =
    pathname === `/${SECONDARY}` || pathname.startsWith(`/${SECONDARY}/`);
  const cookie = request.cookies.get(COOKIE)?.value;
  const isBot = BOT_UA.test(request.headers.get("user-agent") ?? "");

  // Terugkerende bezoeker die eerder de tweede taal koos: houd hem daar.
  if (cookie === SECONDARY && !isSecondaryPath) {
    return NextResponse.redirect(toSecondary(request, SECONDARY));
  }

  // Eerste bezoek op een pad in de standaardtaal: bepaal de taal op basis van
  // het land uit het IP-adres (Vercel-header). Buiten NL/BE: tweede taal.
  if (!cookie && !isSecondaryPath && !isBot) {
    const country = request.headers.get("x-vercel-ip-country");
    if (country && !DEFAULT_LOCALE_COUNTRIES.includes(country)) {
      const response = NextResponse.redirect(toSecondary(request, SECONDARY));
      response.cookies.set(COOKIE, SECONDARY, { path: "/", maxAge: ONE_YEAR });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Sla API-routes, Next-interne paden, bestanden met een extensie én de
  // gegenereerde metadata-routes over. Zonder die laatste uitzondering stuurt de
  // taal-proxy /opengraph-image en /icon naar een 404 (zo gebeurt het in
  // J. Versseput).
  matcher: [
    "/((?!api|_next|_vercel|opengraph-image|twitter-image|icon|apple-icon|.*\\..*).*)",
  ],
};
