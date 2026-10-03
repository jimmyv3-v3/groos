"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/routing";
import { useHydrated, useSearchParam } from "../use-form-behaviour";

/**
 * Verborgen velden (spec 07 §5.2). submissionId, fillMs en UTM komen pas na
 * hydratatie, zodat statische pagina's nooit dezelfde waarde aan iedereen geven.
 */
export function FormMeta({ locale, submissionId }: { locale: Locale; submissionId?: string }) {
  const hydrated = useHydrated();
  const [generated] = useState(() => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : ""));
  const utmSource = useSearchParam("utm_source");
  const utmMedium = useSearchParam("utm_medium");
  const utmCampaign = useSearchParam("utm_campaign");
  const id = submissionId ?? generated;

  return (
    <>
      <input type="hidden" name="locale" value={locale} />
      {hydrated && (
        <>
          {id && <input type="hidden" name="submissionId" value={id} />}
          <input type="hidden" name="fillMs" defaultValue="" />
          {utmSource && <input type="hidden" name="utmSource" value={utmSource.slice(0, 100)} />}
          {utmMedium && <input type="hidden" name="utmMedium" value={utmMedium.slice(0, 100)} />}
          {utmCampaign && <input type="hidden" name="utmCampaign" value={utmCampaign.slice(0, 100)} />}
        </>
      )}
    </>
  );
}
