// BotID op de client (spec 13 §4.4). Beschermt de POST-verzoeken van de
// publieke formulieren (Server Actions posten naar de pagina zelf), de
// uploadroute en het inloggen in het beheer. De server controleert met
// isBotRequest() uit lib/security/botid.ts.
import { initBotId } from "botid/client/core";

const FORM_PAGES = ["/vacatures/*", "/inschrijven", "/werkgevers/personeel-aanvragen", "/contact"];

initBotId({
  protect: [
    ...FORM_PAGES.flatMap((path) => [
      { path, method: "POST" },
      { path: `/en${path}`, method: "POST" },
    ]),
    { path: "/api/upload/*", method: "POST" },
    { path: "/beheer/inloggen", method: "POST" },
    { path: "/beheer/wachtwoord-vergeten", method: "POST" },
  ],
});
