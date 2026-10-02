/** View-modellen van de vacaturebank (spec 06 §4.5). Client-veilig, alleen typen. */
export type { VacancyListItem, VacancyDetail } from "@/lib/data/types";

/** Taal op de werkvloer (spec 06 §5.2, enum workplace_language van spec 10). */
export type { WorkplaceLanguage } from "@/lib/data/options";

export type VacancyCardVariant = "default" | "compact";
export type FilterGroupName = "beroep" | "plaats" | "uren" | "dienst";
export type FilterOption = { value: string; label: string; count: number; checked: boolean; countAria: string };
export type FilterGroup = {
  name: FilterGroupName;
  legend: string;
  options: FilterOption[];
  collapseAfter?: number;
  moreLabel?: string;
};
export type ActiveFilterChip = { key: string; label: string; href: string; removeLabel: string };
export type HiddenField = [name: string, value: string];
