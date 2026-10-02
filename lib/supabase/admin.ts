import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { supabaseEnv } from "./env";

let adminClient: SupabaseClient<Database> | null = null;

/**
 * Client met de secret key (spec 10 §4.2). Omzeilt RLS: alleen voor publieke
 * formulieren (spec 07), cron, Storage-beheer en het aanmaken van beheerders.
 * Eén instantie per serverproces.
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> {
  if (adminClient) return adminClient;
  const { url } = supabaseEnv();
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey || !secretKey.startsWith("sb_secret_")) {
    throw new Error("SUPABASE_SECRET_KEY ontbreekt of begint niet met sb_secret_ (zie .env.example)");
  }
  adminClient = createClient<Database>(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return adminClient;
}
