import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { contact } from "@/lib/site";

/** Ontvangers van interne meldingen (spec 11 §4.8). */

export type NotifyFlag = "notify_applications" | "notify_staff_requests" | "notify_messages";

export async function internalRecipients(flag: NotifyFlag): Promise<string[]> {
  const base = [contact.email.toLowerCase()];
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from("admin_profiles")
      .select("email")
      .eq("is_active", true)
      .eq(flag, true);
    if (error) throw Object.assign(new Error("admin_profiles"), { pgCode: error.code });
    const emails = (data ?? []).map((row) => row.email.trim().toLowerCase()).filter(Boolean);
    return [...new Set([...base, ...emails])].sort();
  } catch (error) {
    console.error("[e-mail] ontvangers lezen mislukt", { flag, pgCode: (error as { pgCode?: string }).pgCode });
    return base;
  }
}
