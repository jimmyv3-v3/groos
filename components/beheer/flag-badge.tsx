import { Badge } from "@/components/ui/badge";
import { S } from "@/app/beheer/_strings";

/** Vlag Uitgelicht (brand) of Spoed (warning). */
export function FlagBadge({ flag }: { flag: "featured" | "urgent" }) {
  return (
    <Badge tone={flag === "featured" ? "brand" : "warning"} dot>
      {S.vacancies.flags[flag]}
    </Badge>
  );
}
