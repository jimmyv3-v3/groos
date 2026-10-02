// STUB: wordt vervangen door spec 09
/** Alleen het Wtta-deel van lib/legal.ts (spec 09 §5.1), nodig voor /werkgevers/wtta. */

export type WttaConfig =
  | { phase: "none" }
  | { phase: "preparing" }
  | { phase: "transition"; since: string }
  | { phase: "provisional"; registerUrl: string; validUntil?: string }
  | { phase: "admitted"; registerNumber: string; registerUrl: string };

// TODO (Jimmy en Lorenzo): fase bevestigen (B-24).
export const WTTA: WttaConfig = { phase: "preparing" };
