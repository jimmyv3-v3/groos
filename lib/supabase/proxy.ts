import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { supabaseEnv } from "./env";

/**
 * Ververst de Supabase-sessie voor paden onder /beheer (spec 10 §4.2). Bedoeld
 * voor proxy.ts (eigendom spec 01, wordt in een latere bouwstap aangesloten).
 * Volgt het patroon uit de Supabase-gids voor Next.js: direct na het maken van
 * de client getClaims(), zonder andere code ertussen.
 */
export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  userId: string | null;
  aal: "aal1" | "aal2" | null;
}> {
  const { url, publishableKey } = supabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const rawAal: unknown = claims?.aal;
  const aal = rawAal === "aal1" || rawAal === "aal2" ? rawAal : null;

  return { response, userId: typeof claims?.sub === "string" ? claims.sub : null, aal };
}
