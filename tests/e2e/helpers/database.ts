// Of de tabellen van spec 10 op groos-dev staan. Zolang de migraties niet zijn
// toegepast, slaan tests die de database nodig hebben zich over met
// test.skip(!(await databaseBeschikbaar()), ZONDER_DATABASE).

export const ZONDER_DATABASE = "De database heeft nog geen tabellen (migraties van spec 10 niet toegepast)";

let cached: Promise<boolean> | null = null;

export function databaseBeschikbaar(): Promise<boolean> {
  if (!cached) {
    try {
      process.loadEnvFile(".env.local");
    } catch {
      // Geen .env.local: dan alleen variabelen uit de shell.
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    cached =
      url && key
        ? fetch(`${url}/rest/v1/public_vacancies?select=id&limit=1`, { headers: { apikey: key } })
            .then((res) => res.ok)
            .catch(() => false)
        : Promise.resolve(false);
  }
  return cached;
}
