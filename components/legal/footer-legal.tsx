import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { contact } from "@/lib/site";
import { publishedLegalDocs } from "@/lib/legal";
import { WttaStatus } from "@/components/legal/wtta-status";

const LINK =
  "inline-flex min-h-11 items-center transition-colors duration-150 hover:text-brand-strong lg:min-h-0";

/**
 * Wettelijke vermeldingen in de footer (spec 09 §4.5, art. 3:15d BW): een
 * registratieregel met naam, adres, KvK en btw, de Wtta-status en de links naar
 * de gepubliceerde juridische documenten. SiteFooter (spec 01 §4.8) zet dit blok
 * in de onderbalk; e-mail en telefoon staan in het contactblok daarboven.
 * Ontbreekt KvK of btw, dan valt dat deel weg (de livegang-check vindt de TODO
 * in lib/site.ts en AC-09-10 faalt).
 */
export async function FooterLegal() {
  const t = await getTranslations("legal");

  const parts = [contact.name, `${contact.street}, ${contact.postalCode} ${contact.city}`];
  if (contact.kvk) parts.push(t("footer.kvk", { number: contact.kvk }));
  if (contact.btw) parts.push(t("footer.vat", { number: contact.btw }));

  return (
    <div className="grid gap-3 text-sm text-muted-foreground">
      <p>
        {parts.map((part, i) => (
          <Fragment key={part}>
            {i > 0 && (
              <span aria-hidden="true" className="hidden sm:inline">
                {" · "}
              </span>
            )}
            <span className="block sm:inline">{part}</span>
          </Fragment>
        ))}
      </p>
      <WttaStatus variant="footer" />
      <nav aria-label={t("footer.ariaLabel")}>
        <ul className="flex flex-wrap gap-x-6">
          {publishedLegalDocs().map((doc) => (
            <li key={doc.id}>
              <Link href={doc.path} className={LINK}>
                {t(`nav.${doc.id}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
