import { test } from "@playwright/test";
import { verwachtGeenAxeBevindingen } from "../helpers/a11y";
import { scrollDoor } from "../helpers/scroll";

// Axe op pagina's die zonder database werken (spec 14 §8.1). De Next-devtools
// (nextjs-portal) bestaan alleen onder `next dev` en vallen buiten de scan.
const PAGINAS = [
  "/",
  "/en",
  "/vacatures",
  "/werken-als/glazenwasser",
  "/werkgevers/schoonmakers",
  "/werkzoekenden",
  "/werkgevers",
  "/contact",
  "/inschrijven",
  "/werkgevers/personeel-aanvragen",
  "/over-ons",
  "/privacyverklaring",
  "/een/twee/drie",
  "/beheer/inloggen",
];

test.describe("axe @a11y @readonly", () => {
  for (const pad of PAGINAS) {
    test(`${pad} heeft geen axe-bevindingen`, async ({ page }) => {
      await page.goto(pad);
      await scrollDoor(page);
      await verwachtGeenAxeBevindingen(page, { uitsluiten: ["nextjs-portal"] });
    });
  }
});
