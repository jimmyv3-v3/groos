// Voegt de namespaces van deze taal samen. Eén JSON-bestand per namespace,
// zodat specs parallel aan hun eigen namespace werken (00 §4.4a).

import common from "./common.json";
import meta from "./meta.json";
import header from "./header.json";
import footer from "./footer.json";
import notFound from "./notFound.json";
import error from "./error.json";
import home from "./home.json";
import about from "./about.json";
import werkzoekenden from "./werkzoekenden.json";
import werkgevers from "./werkgevers.json";
import beroepen from "./beroepen.json";
import vacatures from "./vacatures.json";
import forms from "./forms.json";
import contact from "./contact.json";
import bedankt from "./bedankt.json";
import legal from "./legal.json";

const messages = {
  common,
  meta,
  header,
  footer,
  notFound,
  error,
  home,
  about,
  werkzoekenden,
  werkgevers,
  beroepen,
  vacatures,
  forms,
  contact,
  bedankt,
  legal,
};

export default messages;
