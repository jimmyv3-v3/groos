import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { supabaseEnv } from "./env";

/**
 * Browserclient voor de signed upload en de MFA-schermen (spec 10 §4.2).
 * Alleen importeren vanuit client components; @supabase/ssr houdt één
 * instantie per tabblad aan.
 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  const { url, publishableKey } = supabaseEnv();
  return createBrowserClient<Database>(url, publishableKey);
}
