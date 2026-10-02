import type { TextItem } from "@/content/beroepen/types";
import { BEROEP_ICONS } from "@/content/beroepen/icons";
import type { FeatureItem } from "@/components/service/types";

/** Zet tekstkaarten uit content om naar FeatureItem met het Lucide-icoon. Filter claims vooraf. */
export function toFeatureItems(items: readonly TextItem[]): FeatureItem[] {
  return items.map(({ title, body, icon }) => ({ title, body, icon: icon ? BEROEP_ICONS[icon] : undefined }));
}
