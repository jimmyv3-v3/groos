import "server-only";
import { cache, createElement, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { MessageCircle, Phone, Send, ClipboardList } from "lucide-react";
import { beroepen, type Perspectief } from "@/content/beroepen";
import { contact, footerColumns, nav, whatsappLink, type FooterColumnKey, type NavKey } from "@/lib/site";
import { ROUTES, paths, type AppPath, type HeaderCtaKey, type StaticPath } from "@/lib/routes";

/**
 * Navigatiemodel (spec 01 §5.4): lost nav, headerCtas, actions en
 * footerColumns uit lib/site.ts op voor de huidige taal. Server components
 * geven het resultaat als props aan de clienteilanden, zodat de namespaces
 * header en footer niet naar de browser gaan. Juridische links haalt de
 * footer via FooterLegal (spec 09).
 */

export type ResolvedLink = { href: AppPath; label: string; icon?: ReactNode; emphasis?: boolean };
export type ResolvedAction = { href: string; label: string; ariaLabel?: string; icon: ReactNode; external?: boolean };
export type ResolvedNavItem = {
  key: NavKey;
  href: StaticPath;
  label: string;
  panel?: { beroepen: ResolvedLink[]; beroepenLabel: string; links: ResolvedLink[] };
};
export type ActionKey =
  | "call"
  | "whatsappAlgemeen"
  | "whatsappWerkzoekende"
  | "whatsappWerkgever"
  | "personeelAanvragen"
  | "solliciteren";
export type NavModel = {
  items: ResolvedNavItem[];
  headerCtas: Record<HeaderCtaKey, ResolvedLink>;
  actions: Record<ActionKey, ResolvedAction>;
  footerColumns: { key: FooterColumnKey; title: string; links: ResolvedLink[] }[];
};

const icon = (Icon: typeof Phone) => createElement(Icon, { "aria-hidden": true });

export const getNavModel = cache(async (): Promise<NavModel> => {
  const [t, tb, tc, tf] = await Promise.all([
    getTranslations("header"),
    getTranslations("beroepen"),
    getTranslations("common"),
    getTranslations("footer"),
  ]);

  const beroepLinks = (perspectief: Perspectief): ResolvedLink[] =>
    [...beroepen]
      .sort((a, b) => a.order - b.order)
      .map((b) => ({
        href: perspectief === "werkzoekende" ? paths.werkenAls(b.id) : paths.werkgeverBeroep(b.id),
        label: tb(`${b.id}.${perspectief === "werkzoekende" ? "enkelvoud" : "meervoud"}`),
        icon: icon(b.icon),
      }));

  const items: ResolvedNavItem[] = nav.map((item) => {
    const resolved: ResolvedNavItem = { key: item.key, href: item.href, label: t(`nav.${item.key}`) };
    if ("children" in item) {
      const panel: NonNullable<ResolvedNavItem["panel"]> = { beroepen: [], beroepenLabel: "", links: [] };
      for (const child of item.children) {
        if (child.kind === "beroepen") {
          panel.beroepen = beroepLinks(child.perspectief);
          panel.beroepenLabel = t(
            child.perspectief === "werkzoekende" ? "menu.beroepenWerkzoekenden" : "menu.beroepenWerkgevers",
          );
        } else {
          panel.links.push({
            href: child.href,
            label: t(`nav.${child.key}`),
            icon: icon(child.icon),
            emphasis: "emphasis" in child ? child.emphasis : undefined,
          });
        }
      }
      resolved.panel = panel;
    }
    return resolved;
  });

  // Knoplabels uit common.cta (spec 01 §4.4); header.nav.* blijft voor de menulinks.
  const headerCtas: Record<HeaderCtaKey, ResolvedLink> = {
    inschrijven: { href: ROUTES.inschrijven, label: tc("cta.register") },
    vacatures: { href: ROUTES.vacatures, label: tc("cta.viewJobs") },
    personeelAanvragen: { href: ROUTES.personeelAanvragen, label: tc("cta.requestStaff") },
    contact: { href: ROUTES.contact, label: tc("cta.contact") },
  };

  const whatsapp = (text: string): ResolvedAction => ({
    href: whatsappLink(text),
    label: tc("cta.whatsapp"),
    ariaLabel: `${tc("cta.whatsapp")} ${tc("opensInNewTab")}`,
    icon: icon(MessageCircle),
    external: true,
  });

  const actions: Record<ActionKey, ResolvedAction> = {
    call: {
      href: contact.phoneHref,
      label: tc("cta.call"),
      ariaLabel: t("callAria", { phone: contact.phone }),
      icon: icon(Phone),
    },
    whatsappAlgemeen: whatsapp(tc("whatsapp.algemeen")),
    whatsappWerkzoekende: whatsapp(tc("whatsapp.werkzoekende")),
    whatsappWerkgever: whatsapp(tc("whatsapp.werkgever")),
    personeelAanvragen: { href: ROUTES.personeelAanvragen, label: tc("cta.requestStaff"), icon: icon(ClipboardList) },
    solliciteren: { href: "#solliciteren", label: tc("cta.apply"), icon: icon(Send) },
  };

  const resolvedFooter = footerColumns.map((column) => ({
    key: column.key,
    title: tf(`columns.${column.key}`),
    links: column.links.flatMap((link): ResolvedLink[] =>
      link.kind === "beroepen"
        ? beroepLinks(link.perspectief).map(({ href, label }) => ({ href, label }))
        : [{ href: link.href, label: t(`nav.${link.key}`) }],
    ),
  }));

  return { items, headerCtas, actions, footerColumns: resolvedFooter };
});
