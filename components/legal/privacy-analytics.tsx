"use client";

import { Analytics } from "@vercel/analytics/next";
import { analyticsBeforeSend } from "@/lib/analytics-privacy";

/**
 * `<Analytics>` met het privacyfilter van spec 09 §4.7. Een functie kan niet
 * van een server component naar een client component als prop, daarom deze
 * wrapper. Spec 01 zet hem in app/[locale]/layout.tsx in plaats van <Analytics />.
 */
export function PrivacyAnalytics() {
  return <Analytics beforeSend={analyticsBeforeSend} />;
}
