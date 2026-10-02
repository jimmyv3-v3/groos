import nl from "@/messages/nl";
import en from "@/messages/en";

// Locators lezen tekst uit dezelfde bron als de site (spec 14 §6.1).
const BRONNEN = { nl, en } as const;

type Waarden = Record<string, string | number>;

/** Sleutelpad zoals "notFound.title"; vult {naam} in en haalt rich-tags weg. */
export function t(pad: string, opties: { locale?: "nl" | "en"; waarden?: Waarden } = {}): string {
  let node: unknown = BRONNEN[opties.locale ?? "nl"];
  for (const deel of pad.split(".")) {
    if (node && typeof node === "object" && deel in node) node = (node as Record<string, unknown>)[deel];
    else throw new Error(`Onbekende sleutel: ${pad}`);
  }
  if (typeof node !== "string") throw new Error(`Geen tekst op ${pad}`);
  return node
    .replace(/\{(\w+)\}/g, (heel, naam: string) => String(opties.waarden?.[naam] ?? heel))
    .replace(/<\/?\w+>/g, "");
}
