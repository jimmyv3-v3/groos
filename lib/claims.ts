/**
 * Schakelaars voor claims die pas zichtbaar worden na bevestiging (spec 03 §6.11).
 * Bevestiging vastleggen in docs/compliance/claims-status.md (spec 09 §6.9).
 * Daarna: vlag op true, datum en bron in het commentaar, "TODO" weg, en zo nodig
 * de uitzondering in scripts/check-launch.uitzonderingen.json (spec 14).
 * Een afgewezen claim blijft false, krijgt "afgewezen <datum>" en de copy gaat weg.
 */
const flags = {
  afterHoursUrgent: false, // TODO bevestigen (CL-06, B-22): buiten kantoortijden bereikbaar voor spoed, en via welk nummer
  responseTime: false, // TODO bevestigen (CL-05, CL-09): reactie binnen één werkdag op sollicitaties en aanvragen
  personalIntake: false, // TODO bevestigen (werkwijze): elke kandidaat wordt vóór plaatsing persoonlijk gesproken
  weeklyPay: false, // TODO bevestigen (CL-10): uitbetaling per week
  replacement: false, // TODO bevestigen (werkwijze): vervanging bij uitval, met termijn
  certificateSupport: false, // TODO bevestigen (CL-11): hulp bij VCA, heftruck of IPAF, en wie betaalt
  travelAllowance: false, // TODO bevestigen (VR-07): reiskostenvergoeding als vaste regel
  housing: false, // TODO bevestigen (CL-19): regelt Groos huisvesting (ja met keurmerk, of nee)
  transport: false, // TODO bevestigen (CL-19): vervoer naar het werk
  languagesSpoken: false, // TODO bevestigen (CL-20): andere talen dan Nederlands en Engels die Jimmy en Lorenzo spreken
  serviceForms: false, // TODO bevestigen (CL-18): ook detacheren, werving en selectie of payrolling
  noStartNoCost: false, // TODO bevestigen (werkwijze): opdrachtgever betaalt niets als niemand start
  cao: false, // TODO bevestigen (CL-02, CL-03, B-24): toegepaste cao en lidmaatschap ABU of NBBU
  keurmerk: false, // TODO bevestigen (CL-01, B-24): SNA-keurmerk, NEN 4400-1 of VCU, met registerlink
  gAccount: false, // TODO bevestigen (CL-22): g-rekening
  insurance: false, // TODO bevestigen (CL-22): aansprakelijkheidsverzekering
  invoicing: false, // TODO bevestigen (werkwijze): urenregistratie en factuurritme
  foundingStory: false, // TODO bevestigen (CL-07): oprichtingsjaar en eigen werkervaring van Jimmy en Lorenzo
  workArea: false, // TODO bevestigen (CL-14): plaatsnamen buiten Den Haag en omgeving
  testimonials: false, // TODO bevestigen (CL-08, B-26): alleen echte citaten met naam en toestemming
  clientLogos: false, // TODO bevestigen (CL-08, B-26): alleen logo's met toestemming
};

export type ClaimKey = keyof typeof flags;

/** Bewust als boolean getypeerd (geen `as const`), zodat vergelijkingen de typecheck doorstaan. */
export const claims: Readonly<Record<ClaimKey, boolean>> = flags;

export function isClaimConfirmed(key: ClaimKey): boolean {
  return claims[key];
}

/** Filtert items (FAQ, kaarten, bullets) die een onbevestigde claim dragen. */
export function withConfirmedClaims<T extends { claim?: ClaimKey }>(
  items: readonly T[],
): T[] {
  return items.filter((item) => item.claim === undefined || claims[item.claim]);
}
