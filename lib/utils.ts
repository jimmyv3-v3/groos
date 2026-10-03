import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Eigen tekstgroottes uit app/globals.css. Zonder deze regel ziet tailwind-merge
// "text-h2" als een kleur en valt hij weg naast "text-foreground" (getest met 3.7.0).
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["hero", "h1", "h2", "h3", "lead"] } },
});

/** Voeg Tailwind-klassen samen; bij conflicten wint de laatste. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
