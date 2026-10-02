import { getTranslations } from "next-intl/server";
import { ArrowRight, ClipboardList, Briefcase, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";

/**
 * Inhoud van de gelokaliseerde 404 (spec 01 §4.13): h1, twee zinnen, drie
 * veelgezochte pagina's en een link naar de homepage. Gedeeld door
 * app/[locale]/not-found.tsx en het vangnet app/[locale]/[...rest].
 */
export async function NotFoundView() {
  const t = await getTranslations("notFound");
  const links = [
    { href: ROUTES.vacatures, label: t("links.vacatures"), icon: Briefcase },
    { href: ROUTES.personeelAanvragen, label: t("links.personeel"), icon: ClipboardList },
    { href: ROUTES.contact, label: t("links.contact"), icon: MessageCircle },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="container max-w-2xl">
        <h1 className="text-h1">{t("title")}</h1>
        <p className="mt-6 text-lead text-muted-foreground">{t("body")}</p>
        <ul aria-label={t("linksLabel")} className="mt-10 divide-y divide-border border-y border-border">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex min-h-14 items-center gap-4 py-3 text-base font-medium text-foreground transition-colors duration-150 hover:text-brand-strong"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="flex-1">{label}</span>
                <ArrowRight
                  className="size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand motion-reduce:transition-none"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link href="/" className="text-sm font-medium text-brand underline-offset-4 hover:underline">
            {t("home")}
          </Link>
        </p>
      </div>
    </section>
  );
}
