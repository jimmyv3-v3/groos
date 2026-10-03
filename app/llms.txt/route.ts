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
import { publishedLegalDocs, type LegalDocId } from "@/lib/legal";
import { ROUTES, STATIC_ROUTES, paths, type StaticPath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt volgens llmstxt.org (spec 12 §4.9): een korte Markdown-samenvatting
 * uit dezelfde registers en messages als de site. Geen vacaturedata; /vacatures
 * is altijd actueel. Vaste routes uit STATIC_ROUTES (published en llms "kern"),
 * juridische documenten uit publishedLegalDocs() onder "Optional" (B-40).
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
};

/** Vaste koppeling route naar <namespace>.meta.description (spec 12 §4.9). */
const DESCRIPTIONS: Partial<Record<StaticPath, string>> = {
  [ROUTES.vacatures]: vacatures.meta.description,
  [ROUTES.werkzoekenden]: werkzoekenden.meta.description,
  [ROUTES.werkgevers]: werkgevers.meta.description,
  [ROUTES.overOns]: about.meta.description,
  [ROUTES.contact]: contactText.meta.description,
};

const LEGAL_LABELS: Record<LegalDocId, string> = {
  privacy: legal.nav.privacy,
  cookies: legal.nav.cookies,
  complaints: legal.nav.complaints,
  terms: legal.nav.terms,
};

const WERKZOEKENDE = new Set<StaticPath>([ROUTES.vacatures, ROUTES.werkzoekenden, ROUTES.inschrijven]);
const WERKGEVER = new Set<StaticPath>([ROUTES.werkgevers, ROUTES.personeelAanvragen, ROUTES.wtta]);

const lowerFirst = (s: string) => s.charAt(0).toLocaleLowerCase("nl") + s.slice(1);
const sentence = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

function link(path: string, label: string, description?: string): string {
  return `- [${label}](${absoluteUrl(path)})${description ? `: ${description}` : ""}`;
}

/** Kernroutes met published en llms "kern"; de homepage staat er niet als link in. */
function routeLines(filter: (path: StaticPath) => boolean): string[] {
  return STATIC_ROUTES.filter((r) => r.published && r.llms === "kern" && r.path !== ROUTES.home && filter(r.path)).map(
    (r) => link(r.path, LABELS[r.path] ?? r.path, DESCRIPTIONS[r.path]),
  );
}

export function GET() {
  // NAW uit contact (lib/site.ts) plus common.address.byAppointment; KvK en btw alleen als ze gevuld zijn.
  const naw = [
    `${contact.name}, ${contact.street}, ${contact.postalCode} ${contact.city}.`,
    sentence(common.address.byAppointment),
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
    ...routeLines((p) => WERKZOEKENDE.has(p)),
    ...beroepen.map((b) => link(paths.werkenAls(b.id), `${header.menu.beroepenWerkzoekenden} ${lowerFirst(beroepenText[b.id].enkelvoud)}`)),
    "",
    `## ${header.nav.werkgevers}`,
    "",
    ...routeLines((p) => WERKGEVER.has(p)),
    ...beroepen.map((b) => link(paths.werkgeverBeroep(b.id), beroepenText[b.id].meervoud)),
    "",
    "## Groos",
    "",
    ...routeLines((p) => !WERKZOEKENDE.has(p) && !WERKGEVER.has(p)),
    "",
    "## Optional",
    "",
    ...publishedLegalDocs().map((d) => link(d.path, LEGAL_LABELS[d.id])),
    ...((routing.locales as readonly string[]).includes("en") ? [link("/en", "English version")] : []),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
