import { Link } from "@/i18n/navigation";
import { Chip } from "@/components/ui/chip";
import type { ActiveFilterChip } from "./types";

type Props = { chips: ActiveFilterChip[]; clearHref: string; labels: { list: string; clearAll: string } };

/** Actieve filters als chips (spec 06 §4.5); elke chip verwijdert alleen zijn eigen waarde. */
export function VacancyActiveFilters({ chips, clearHref, labels }: Props) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <ul role="list" aria-label={labels.list} className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip.key}>
            <Chip href={chip.href} removeLabel={chip.removeLabel}>
              {chip.label}
            </Chip>
          </li>
        ))}
      </ul>
      <Link href={clearHref} className="link inline-flex min-h-11 items-center text-sm font-medium">
        {labels.clearAll}
      </Link>
    </div>
  );
}
