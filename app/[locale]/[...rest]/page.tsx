import { notFound } from "next/navigation";

// Vangnet voor onbekende paden onder een geldige taal (spec 01 §4.13), zodat
// ze de gelokaliseerde not-found.tsx binnen de layout krijgen.
export default function CatchAll() {
  notFound();
}
