import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { OccupationSlug } from "@/lib/data/options";
import { contact, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { FormId } from "@/lib/validation/shared";
import { TrackedContactLink } from "./tracked-contact-link";

type ContactAsideProps = {
  form: FormId;
  locale: Locale;
  title: string;
  body: string;
  whatsappText: string;
  /** false verbergt de WhatsApp-knop, bijvoorbeeld bij een vacature zonder solliciteren via WhatsApp. */
  whatsapp?: boolean;
  analytics?: { beroep?: OccupationSlug; vacature?: number };
  variant?: "strip" | "panel";
};

/**
 * Bellen en WhatsApp met ons team als gelijkwaardige route naast het formulier
 * (spec 07 §4.5), altijd op het ene nummer uit lib/site.ts (B-60). Strook onder lg, paneel vanaf lg. Opbouw naar 21st.dev 5689 (efferd).
 */
export async function ContactAside({
  form,
  locale,
  title,
  body,
  whatsappText,
  whatsapp = true,
  analytics,
  variant = "panel",
}: ContactAsideProps) {
  const [tf, tc] = await Promise.all([
    getTranslations({ locale, namespace: "forms.common" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const strip = variant === "strip";
  return (
    <aside
      aria-label={tf("alternativesLabel")}
      className={cn("rounded-xl border border-border bg-ice", strip ? "p-4 sm:p-5" : "p-6")}
    >
      <h3 className="font-display text-h3 font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-base text-muted-foreground">{body}</p>
      {/* Strook: naast elkaar zolang de labels passen, anders onder elkaar (Engels op 320 px). */}
      <div className={cn("mt-4 gap-2", strip ? "flex flex-wrap" : "grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2")}>
        <TrackedContactLink
          kind="call"
          form={form}
          href={contact.phoneHref}
          label={tc("cta.call")}
          ariaLabel={tc("a11y.call", { phone: contact.phone })}
          beroep={analytics?.beroep}
          vacature={analytics?.vacature}
          className={strip ? "flex-1 px-3" : "w-full"}
        />
        {whatsapp && (
          <TrackedContactLink
            kind="whatsapp"
            form={form}
            href={whatsappLink(whatsappText)}
            label={tc("cta.whatsapp")}
            external
            newTabLabel={tc("opensInNewTab")}
            beroep={analytics?.beroep}
            vacature={analytics?.vacature}
            className={strip ? "flex-1 px-3" : "w-full"}
          />
        )}
      </div>
    </aside>
  );
}
