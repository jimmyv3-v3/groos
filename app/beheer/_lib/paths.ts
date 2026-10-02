// STUB: wordt vervangen door spec 08
/**
 * Minimale stub van de padhelpers van het beheer (spec 08 §4.2), gemaakt door
 * de bouw-agent van spec 11 voor de links in de meldingsmails. De versie van
 * spec 08 wint bij de merge. Client-veilig.
 */
import { site } from "@/lib/site";

export const beheerPaths = {
  home: "/beheer", login: "/beheer/inloggen", mfa: "/beheer/mfa", mfaEnroll: "/beheer/mfa/koppelen",
  forgot: "/beheer/wachtwoord-vergeten", setPassword: "/beheer/wachtwoord-instellen",
  noAccess: "/beheer/geen-toegang", confirm: "/beheer/auth/bevestigen", more: "/beheer/meer",
  vacancies: "/beheer/vacatures", vacancyNew: "/beheer/vacatures/nieuw",
  vacancy: (n: number) => `/beheer/vacatures/${n}` as const,
  vacancyPreview: (n: number) => `/beheer/vacatures/${n}/voorbeeld` as const,
  applications: "/beheer/sollicitaties", application: (ref: string) => `/beheer/sollicitaties/${ref}` as const,
  requests: "/beheer/aanvragen", request: (ref: string) => `/beheer/aanvragen/${ref}` as const,
  messages: "/beheer/berichten", message: (id: string) => `/beheer/berichten/${id}` as const,
} as const;

/** Alleen paden die met /beheer beginnen, zonder //, \ of schema; anders "/beheer". */
export function safeNext(value: string | null | undefined): string {
  if (!value || !(value === "/beheer" || value.startsWith("/beheer/"))) return beheerPaths.home;
  if (value.includes("//") || value.includes("\\") || /^[a-z]+:/i.test(value)) return beheerPaths.home;
  return value;
}

/** Productie: site.url; preview: https://${VERCEL_URL}; anders http://localhost:3000. Server-only gebruik. */
export function beheerOrigin(): string {
  if (process.env.VERCEL_ENV === "production") return site.url;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Absolute URL voor links in meldingsmails van spec 11. */
export function beheerUrl(path: string): string {
  return `${beheerOrigin()}${path}`;
}
