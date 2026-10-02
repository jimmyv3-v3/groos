import nl from "@/messages/nl.json";
import { routing } from "@/i18n/routing";
import { services } from "@/content/services";
import { cities } from "@/content/werkgebied";
import { contact } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt volgens llmstxt.org: een korte, Markdown-samenvatting van de site
 * voor AI-assistenten en zoekmachines met AI-antwoorden. Wordt opgebouwd uit
 * dezelfde bronnen als de site zelf, dus er is niets apart bij te houden.
 */
export const dynamic = "force-static";

type ServiceText = { title: string; summary: string };

export function GET() {
  const serviceText = nl.services as Record<string, ServiceText>;

  const lines = [
    `# ${contact.shortName}`,
    "",
    `> ${nl.meta.description}`,
    "",
    `${contact.name} is gevestigd in ${contact.city} (KvK ${contact.kvk}). Offerte aanvragen kan via ${absoluteUrl("/")}#contact, telefonisch via ${contact.phone} of per e-mail via ${contact.email}.`,
    "",
    "## Diensten",
    "",
    ...services.map((s) => {
      const text = serviceText[s.slug];
      return `- [${text?.title ?? s.slug}](${absoluteUrl(`/diensten/${s.slug}`)}): ${text?.summary ?? ""}`;
    }),
    "",
    "## Werkgebied",
    "",
    `- [Overzicht werkgebied](${absoluteUrl("/werkgebied")})`,
    ...cities.map((c) => `- [${c.name}](${absoluteUrl(`/werkgebied/${c.slug}`)})`),
    "",
    "## Optional",
    "",
    `- [Privacybeleid](${absoluteUrl("/privacybeleid")})`,
    `- [Algemene voorwaarden](${absoluteUrl("/algemene-voorwaarden")})`,
    ...((routing.locales as readonly string[]).includes("en")
      ? [`- [English version](${absoluteUrl("/en")})`]
      : []),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
