import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { publishedLegalDocs } from "@/lib/legal";
import { contact } from "@/lib/site";
import { WttaStatus } from "@/components/legal/wtta-status";

/**
 * Wettelijke vermeldingen in de onderbalk van de footer (spec 09 §4.5; plek
 * spec 01 §4.8): registratieregel met KvK en btw, de Wtta-status en de
 * juridische links uit publishedLegalDocs(). Eigenaar spec 09; spec 01 maakte
 * deze versie in de nazorg van bouwstap 3b, zodat de footer compileert.
 */
export async function FooterLegal() {
  const t = await getTranslations("legal");
  const parts = [
    contact.name,
    `${contact.street}, ${contact.postalCode} ${contact.city}`,
    contact.kvk ? t("footer.kvk", { number: contact.kvk }) : null,
    contact.btw ? t("footer.vat", { number: contact.btw }) : null,
  ].filter((part): part is string => part !== null);

  return (
    <div className="grid gap-3 text-sm text-muted-foreground">
      <p className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-2">
        {parts.map((part, i) => (
          <span key={part} className="sm:inline-flex sm:gap-x-2">
            {i > 0 && (
              <span aria-hidden="true" className="hidden sm:inline">
                ·
              </span>
            )}
            {part}
          </span>
        ))}
      </p>
      <WttaStatus variant="footer" />
      <nav aria-label={t("footer.ariaLabel")}>
        <ul className="flex flex-wrap gap-x-6">
          {publishedLegalDocs().map((doc) => (
            <li key={doc.id}>
              <Link
                href={doc.path}
                className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-brand-strong lg:min-h-0"
              >
                {t(`nav.${doc.id}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
