/**
 * Publieke URL van een bestand in de bucket public-media (spec 10 §4.5).
 * Client-veilig: gebruikt alleen NEXT_PUBLIC_SUPABASE_URL.
 */
export function publicMediaUrl(path: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!path || !base) return null;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/public-media/${path}`;
}
