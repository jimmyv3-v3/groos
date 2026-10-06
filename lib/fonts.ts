import { Instrument_Sans, Onest } from "next/font/google";

/**
 * `subsets` bepaalt alleen wat vooraf wordt geladen (preload). Nederlands en
 * Engels, met é, ë, ï en €, staan volledig in "latin". De overige subsets
 * (latin-ext, Cyrillisch) blijven beschikbaar en laden pas als een teken ze
 * nodig heeft, zodat een telefoon bij het eerste bezoek twee lettertypebestanden
 * ophaalt in plaats van vier.
 */

/** Lopende tekst en interface. */
export const fontSans = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});

/** Koppen en woordmerk. Variabel gewicht 400 tot 700, standaardbreedte. */
export const fontDisplay = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
