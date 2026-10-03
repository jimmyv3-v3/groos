import { Instrument_Sans, Onest } from "next/font/google";

/** Lopende tekst en interface. Onest heeft ook Cyrillisch; dat wordt niet vooraf geladen. */
export const fontSans = Onest({
  subsets: ["latin", "latin-ext"],
  variable: "--font-onest",
  display: "swap",
});

/** Koppen en woordmerk. Variabel gewicht 400 tot 700, standaardbreedte. */
export const fontDisplay = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
});
