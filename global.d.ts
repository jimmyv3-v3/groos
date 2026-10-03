import type { routing } from "@/i18n/routing";
import type { formats } from "@/i18n/formats";
import type messages from "./messages/nl";

// Getypeerde messages (spec 01 §4.11.3): tsc geeft een fout bij een sleutel die
// niet in messages/nl/*.json staat. npm run check bewaakt de spiegeling met en.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
