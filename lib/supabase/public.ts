import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { supabaseEnv } from "./env";

/**
 * Client met de publishable key en zonder sessie (spec 10 §4.2). Gebruikt geen
 * cookies, dus bruikbaar binnen unstable_cache. Rol in Postgres: anon, dus
 * RLS geldt.
 */
export function createSupabasePublicClient(): SupabaseClient<Database> {
  const { url, publishableKey } = supabaseEnv();
  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
