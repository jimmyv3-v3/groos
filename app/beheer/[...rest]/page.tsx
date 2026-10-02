import { notFound } from "next/navigation";

/** Vangnet voor onbekende paden onder /beheer: de 404 van het beheer (spec 08 §4.1). */
export default function BeheerCatchAll(): never {
  notFound();
}
