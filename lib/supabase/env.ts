/**
 * Leest en controleert de publieke Supabase-variabelen (spec 10 §4.2).
 * process.env.NEXT_PUBLIC_* staat hier letterlijk, zodat Next de waarden in de
 * browserbundle kan inlinen. De secret key staat alleen in admin.ts.
 */

const NOT_CONFIGURED =
  "Supabase is niet geconfigureerd: zet NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local";

/** True als URL en publishable key gezet zijn. */
export function hasSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

/** URL en publishable key; gooit als een van beide ontbreekt. */
export function supabaseEnv(): { url: string; publishableKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) throw new Error(NOT_CONFIGURED);
  return { url, publishableKey };
}
