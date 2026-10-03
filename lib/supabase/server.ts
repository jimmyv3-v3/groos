import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { supabaseEnv } from "./env";

export type SupabaseServerClient = SupabaseClient<Database>;

/**
 * Sessieclient voor Server Components, Server Actions en route handlers
 * (spec 10 §4.2). Maak per request een nieuwe client.
 */
export async function createSupabaseServerClient(): Promise<SupabaseServerClient> {
  const { url, publishableKey } = supabaseEnv();
  const cookieStore = await cookies();
  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components mogen geen cookies schrijven; updateSession() in
          // proxy.ts ververst de sessie dan.
        }
      },
    },
  });
}
