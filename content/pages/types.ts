import type { CtaCopy, FaqEntry, ListItem, SectionHead, TextItem } from "@/content/beroepen/types";

/** Typen voor de lange tekst van /werkzoekenden, /werkgevers en /werkgevers/wtta (spec 05 §5.4). */

export type CompareCopy = SectionHead & {
  caption: string;
  jobseekerTitle: string;
  employerTitle: string;
  jobseekerLinkLabel: string;
  employerLinkLabel: string;
  /** Waarden zonder je of u, zodat de rij op beide pagina's past (spec 03 §6.2). 4..5 rijen. */
  rows: { label: string; jobseeker: string; employer: string }[];
};

export type WerkzoekendenCopy = {
  hero: { title: string; lead: string };
  beroepen: SectionHead;
  /** 4..6 */
  promises: SectionHead & { items: TextItem[] };
  /** 5..7 */
  rights: SectionHead & { items: ListItem[] };
  vacancies: SectionHead & { emptyTitle: string; emptyBody: string };
  compare: CompareCopy;
  /** 7..8, specific altijd false */
  faq: SectionHead & { items: FaqEntry[] };
  cta: CtaCopy;
};

export type WerkgeversCopy = {
  hero: { title: string; lead: string };
  /** 4 */
  supply: SectionHead & { items: TextItem[] };
  beroepen: SectionHead;
  /** 4..5 */
  agency: SectionHead & { items: { term: string; description: string }[] };
  legal: SectionHead & { items: ListItem[]; wttaLinkLabel: string };
  compare: CompareCopy;
  /** 7..8 */
  faq: SectionHead & { items: FaqEntry[] };
  cta: CtaCopy;
};

export type WttaMilestone = {
  date: string;
  /** Verplicht als de mijlpaal een periode is; anders maakt de pagina het label met formatDate. */
  dateLabel?: string;
  title: string;
  body: string;
  /** Korte bronnaam met datum, als kleine regel onder het item. */
  source: string;
};

export type WttaCopy = {
  /** ISO, getoond als "Bijgewerkt op ..." */
  reviewedAt: string;
  hero: { title: string; lead: string };
  /** 2..3 */
  about: SectionHead & { paragraphs: string[] };
  /** 6 */
  timeline: SectionHead & { items: WttaMilestone[] };
  /** 4..5 */
  hirer: SectionHead & { items: ListItem[] };
  /** 3 */
  check: SectionHead & { steps: { title: string; body: string }[] };
  status: SectionHead;
  /** 2 */
  liability: SectionHead & { paragraphs: string[] };
  /** 5..6 */
  faq: SectionHead & { items: FaqEntry[] };
  sources: { title: string; intro: string; items: { label: string; href: string }[] };
  cta: CtaCopy;
};

export type Localized<T> = { nl: T; en: T };
