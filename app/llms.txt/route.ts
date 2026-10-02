import common from "@/messages/nl/common.json";
import meta from "@/messages/nl/meta.json";
import header from "@/messages/nl/header.json";
import beroepenText from "@/messages/nl/beroepen.json";
import legal from "@/messages/nl/legal.json";
import vacatures from "@/messages/nl/vacatures.json";
import werkzoekenden from "@/messages/nl/werkzoekenden.json";
import werkgevers from "@/messages/nl/werkgevers.json";
import about from "@/messages/nl/about.json";
import contactText from "@/messages/nl/contact.json";
import { routing } from "@/i18n/routing";
import { beroepen } from "@/content/beroepen";
import { contact } from "@/lib/site";
import { ROUTES, STATIC_ROUTES, paths, type StaticPath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt volgens llmstxt.org (spec 12 §4.9, spec 01 §7.3): een korte
 * Markdown-samenvatting uit dezelfde registers en messages als de site. Geen
 * vacaturedata; /vacatures is altijd actueel. Spec 12 vervangt het filter op
 * `published` voor juridische routes door publishedLegalDocs() van spec 09.
 */
export const dynamic = "force-static";

const LABELS: Partial<Record<StaticPath, string>> = {
  [ROUTES.vacatures]: header.nav.vacatures,
  [ROUTES.werkzoekenden]: header.nav.werkzoekenden,
  [ROUTES.inschrijven]: header.nav.inschrijven,
  [ROUTES.werkgevers]: header.nav.werkgevers,
  [ROUTES.personeelAanvragen]: header.nav.personeelAanvragen,
  [ROUTES.wtta]: header.nav.wtta,
  [ROUTES.overOns]: header.nav.overOns,
  [ROUTES.contact]: header.nav.contact,
  [ROUTES.privacyverklaring]: legal.nav.privacy,
  [ROUTES.cookieverklaring]: legal.nav.cookies,
  [ROUTES.klachtenregeling]: legal.nav.complaints,
  [ROUTES.algemeneVoorwaarden]: legal.nav.terms,
};

const DESCRIPTIONS: Partial<Record<StaticPath, string>> = {
  [ROUTES.vacatures]: vacatures.meta.description,
  [ROUTES.werkzoekenden]: werkzoekenden.meta.description,
  [ROUTES.werkgevers]: werkgevers.meta.description,
  [ROUTES.overOns]: about.meta.description,
  [ROUTES.contact]: contactText.meta.description,
};

const WERKZOEKENDE = new Set<StaticPath>([ROUTES.vacatures, ROUTES.werkzoekenden, ROUTES.inschrijven]);
const WERKGEVER = new Set<StaticPath>([ROUTES.werkgevers, ROUTES.personeelAanvragen, ROUTES.wtta]);

function link(path: string, label: string, description?: string): string {
  return `- [${label}](${absoluteUrl(path)})${description ? `: ${description}` : ""}`;
}

function routeLines(filter: (path: StaticPath) => boolean, llms: "kern" | "optioneel"): string[] {
  return STATIC_ROUTES.filter((r) => r.published && r.llms === llms && r.path !== "/" && filter(r.path)).map((r) =>
    link(r.path, LABELS[r.path] ?? r.path, DESCRIPTIONS[r.path]),
  );
}

export function GET() {
  const lower = (s: string) => s.charAt(0).toLocaleLowerCase("nl") + s.slice(1);
  const naw = [
    `${contact.name}, ${contact.street}, ${contact.postalCode} ${contact.city} (${lower(common.address.byAppointment).replace(/\.$/, "")}).`,
    `Telefoon en WhatsApp: ${contact.phone}.`,
    `E-mail: ${contact.email}.`,
    ...(contact.kvk ? [`KvK: ${contact.kvk}.`] : []),
    ...(contact.btw ? [`Btw: ${contact.btw}.`] : []),
  ].join(" ");

  const lines = [
    `# ${contact.shortName}`,
    "",
    `> ${meta.organizationDescription}`,
    "",
    naw,
    "",
    `Werkzoekenden solliciteren op een vacature of schrijven zich in via ${absoluteUrl(ROUTES.inschrijven)}. Opdrachtgevers vragen personeel aan via ${absoluteUrl(ROUTES.personeelAanvragen)}.`,
    "",
    `## ${header.nav.werkzoekenden}`,
    "",
    ...routeLines((p) => WERKZOEKENDE.has(p), "kern"),
    ...beroepen.map((b) => link(paths.werkenAls(b.id), `${header.menu.beroepenWerkzoekenden} ${lower(beroepenText[b.id].enkelvoud)}`)),
    "",
    `## ${header.nav.werkgevers}`,
    "",
    ...routeLines((p) => WERKGEVER.has(p), "kern"),
    ...beroepen.map((b) => link(paths.werkgeverBeroep(b.id), beroepenText[b.id].meervoud)),
    "",
    "## Groos",
    "",
    ...routeLines((p) => !WERKZOEKENDE.has(p) && !WERKGEVER.has(p), "kern"),
    "",
    "## Optional",
    "",
    ...routeLines(() => true, "optioneel"),
    ...((routing.locales as readonly string[]).includes("en") ? [link("/en", "English version")] : []),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
