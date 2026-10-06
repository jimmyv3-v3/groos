import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Proxy-tak voor /beheer (spec 08 §4.13, B-38). Ververst de sessie, zet
 * noindex en no-store, en stuurt optimistisch door op basis van de cookies.
 * Geen databasequery: de echte controle zit in requireAdmin(), withAdmin() en
 * de RLS.
 */
const PUBLIC = [/^\/beheer\/manifest\.webmanifest$/, /^\/beheer\/icon(\/.*)?$/, /^\/beheer\/auth\/bevestigen$/];
const ENTRY = ["/beheer/inloggen", "/beheer/wachtwoord-vergeten"];
const BETWEEN = ["/beheer/mfa", "/beheer/mfa/koppelen", "/beheer/wachtwoord-instellen", "/beheer/geen-toegang"];

function withHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function beheerProxy(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (PUBLIC.some((re) => re.test(pathname))) return withHeaders(NextResponse.next({ request }));

  const { response, userId, aal } = hasSupabaseEnv()
    ? await updateSession(request)
    : { response: NextResponse.next({ request }), userId: null, aal: null };

  // Server Actions krijgen nooit een redirect; de actie geeft zelf sessie_verlopen.
  if (request.method === "POST" && request.headers.has("next-action")) return withHeaders(response);

  const redirectTo = (target: string, next?: string) => {
    const url = request.nextUrl.clone();
    url.pathname = target;
    url.search = "";
    if (next) url.searchParams.set("volgende", next);
    const redirect = NextResponse.redirect(url, 307);
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return withHeaders(redirect);
  };

  if (ENTRY.includes(pathname)) {
    return aal === "aal2" ? redirectTo("/beheer") : withHeaders(response);
  }

  if (BETWEEN.includes(pathname)) {
    return userId ? withHeaders(response) : redirectTo("/beheer/inloggen");
  }

  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (!userId) return redirectTo("/beheer/inloggen", next);
  // Of een aal1-sessie nog een code nodig heeft, hangt af van het account (B-62);
  // requireAdmin() stuurt dan door naar /beheer/mfa.
  return withHeaders(response);
}
