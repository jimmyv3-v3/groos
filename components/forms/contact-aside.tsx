import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { OccupationSlug } from "@/lib/data/options";
import { whatsappLink, type Phone } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { FormId } from "@/lib/validation/shared";
import { TrackedContactLink } from "./tracked-contact-link";

type ContactAsideProps = {
  form: FormId;
  locale: Locale;
  title: string;
  body: string;
  whatsappText: string;
  persons: { name: string; phone: Phone; whatsapp: boolean }[];
  analytics?: { beroep?: OccupationSlug; vacature?: number };
  variant?: "strip" | "panel";
};

/**
 * Bellen en WhatsApp als gelijkwaardige route naast het formulier (spec 07
 * §4.5). Strook onder lg, paneel vanaf lg. Opbouw naar 21st.dev 5689 (efferd).
 */
export async function ContactAside({
  form,
  locale,
  title,
  body,
  whatsappText,
  persons,
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
      <ul className="mt-4 grid gap-3">
        {persons.map((person) => (
          <li key={person.name} className={cn("grid gap-2", strip ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2")}>
            <TrackedContactLink
              kind="call"
              form={form}
              href={`tel:${person.phone.e164}`}
              label={tc("cta.callPerson", { name: person.name })}
              ariaLabel={tc("a11y.callPerson", { name: person.name, phone: person.phone.display })}
              beroep={analytics?.beroep}
              vacature={analytics?.vacature}
              className="w-full"
            />
            {person.whatsapp && (
              <TrackedContactLink
                kind="whatsapp"
                form={form}
                href={whatsappLink(whatsappText, person.phone)}
                label={tc("cta.whatsappPerson", { name: person.name })}
                external
                newTabLabel={tc("opensInNewTab")}
                beroep={analytics?.beroep}
                vacature={analytics?.vacature}
                className="w-full"
              />
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
