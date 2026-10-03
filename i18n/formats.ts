import type { Formats } from "next-intl";

/** Gedeelde formaten voor next-intl (spec 01 §4.11.2). Spec 06 gebruikt "datum" en "euro". */
export const formats = {
  dateTime: {
    datum: { day: "numeric", month: "long", year: "numeric" },
    kort: { day: "numeric", month: "short" },
  },
  number: { euro: { style: "currency", currency: "EUR", minimumFractionDigits: 2 } },
} satisfies Formats;
