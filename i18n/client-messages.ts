import type { Messages } from "next-intl";

/**
 * Alleen deze namespaces gaan naar de browser (spec 01 §4.11.4). Een spec die
 * in een clientcomponent useTranslations met een andere namespace gebruikt,
 * voegt die hier toe. Voorkeur: tekst als props vanuit een server component.
 * `vacatures` staat er niet in: de vacatureclientcomponenten krijgen hun tekst als props.
 */
export const CLIENT_NAMESPACES = ["common", "error", "forms"] as const;

export function pickClientMessages(messages: Messages): Partial<Messages> {
  return Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  ) as Partial<Messages>;
}
