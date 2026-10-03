import type { ClaimKey } from "@/lib/claims";
import type { BeroepId } from "@/content/beroepen";
import type { BeroepIcon } from "@/content/beroepen/icons";

/**
 * Typen voor de lange tekst per beroep (spec 05 §5.2). Geen runtime-imports,
 * zodat de databestanden ook buiten Next (tests, scripts) te laden zijn.
 * Lengtes in de commentaren worden gecontroleerd door
 * tests/unit/content/beroepen-kwaliteit.test.ts.
 */

export type Claimable = { claim?: ClaimKey };
export type SectionHead = { title: string; accent?: string; intro?: string };
export type TextItem = Claimable & { title: string; body: string; icon?: BeroepIcon };
export type ListItem = Claimable & { text: string };
export type FaqEntry = Claimable & {
  q: string;
  a: string;
  /** true als de vraag alleen over dit beroep gaat */
  specific: boolean;
};
export type CertificateNeed = "always" | "often" | "sometimes" | "plus";
export type CertificateEntry = Claimable & { name: string; need: CertificateNeed; body: string };
export type HeroFactCopy = { label: string; value: string };
export type MetaCopy = { title: string; description: string; keywords: string[] };
export type CtaCopy = { title: string; accent: string; body: string };
export type Tuple3<T> = readonly [T, T, T];
export type Tuple4<T> = readonly [T, T, T, T];

export type JobseekerCopy = {
  meta: MetaCopy;
  /** facts: 1 of 2 items; de loonchip zet de pagina zelf. */
  hero: { title: string; lead: string; facts: HeroFactCopy[] };
  /** tasks 5..7, places 3..5 */
  work: SectionHead & { tasks: string[]; placesTitle: string; places: string[] };
  /** items 3..6 */
  requirements: SectionHead & { items: string[]; minAgeNote?: string };
  /** extra: toeslagen in één zin */
  wage: SectionHead & { sourceLabel: string; extra?: string };
  schedule: SectionHead & { items: Tuple3<TextItem> };
  /** 2..4 */
  certificates: SectionHead & { items: CertificateEntry[] };
  /** eigen waarom-kop */
  why: SectionHead & { items: Tuple3<TextItem> };
  /** steps 3..5 */
  career: SectionHead & { steps: string[]; note?: string };
  vacancies: SectionHead & { emptyTitle: string; emptyBody: string };
  /** 6..7, specific >= 4 */
  faq: SectionHead & { items: FaqEntry[] };
  perspective: { text: string; linkLabel: string };
  /** eigen CTA-kop */
  cta: CtaCopy;
};

export type EmployerCopy = {
  /** serviceType voor serviceLd */
  meta: MetaCopy & { serviceType: string };
  hero: { title: string; lead: string };
  /** tasks 5..7, clients 3..5 */
  supply: SectionHead & { tasks: string[]; clientsTitle: string; clients: string[] };
  /** eigen waarom-kop */
  why: SectionHead & { items: Tuple4<TextItem> };
  certificates: SectionHead & { items: CertificateEntry[] };
  planning: SectionHead & { items: Tuple3<TextItem> };
  /** items 3..5 */
  legal: SectionHead & { items: ListItem[]; wttaLinkLabel: string };
  /** 6..8, specific >= helft */
  faq: SectionHead & { items: FaqEntry[] };
  perspective: { text: string; linkLabel: string };
  cta: CtaCopy;
};

export type BeroepCopy = { jobseeker: JobseekerCopy; employer: EmployerCopy };

export type WageFacts = {
  /** Bruto per uur, 21 jaar en ouder, zonder ervaring. */
  starter: { min: number; max: number };
  /** Optioneel: bandbreedte met ervaring. */
  experienced?: { min: number; max: number };
  /** ISO-datum van de loontabel waar de bedragen uit komen. */
  tableDate: string;
  /** ISO-datum waarop de bedragen zijn gecontroleerd (peildatum op de pagina). */
  checkedAt: string;
  /** ISO-datum waarop de bedragen opnieuw bekeken moeten worden (volgende loonsverhoging). */
  reviewBy: string;
  sourceUrl: string;
};

export type BeroepContent = {
  id: BeroepId;
  wage: WageFacts;
  /** Arbo-reden voor 18+, gelijk aan MIN_AGE_REASONS uit lib/data/options.ts, of null. */
  minAge18: "work_at_height" | "construction_demolition" | "forklift" | null;
  nl: BeroepCopy;
  en: BeroepCopy;
};
