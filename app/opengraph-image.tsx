import meta from "@/messages/nl/meta.json";
import { contact } from "@/lib/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

/**
 * Site-brede OG-afbeelding (spec 12 §4.6): kop meta.ogHeadline en subregel
 * meta.ogSubline, altijd Nederlands; /en gebruikt hetzelfde beeld (B-45).
 */
export const alt = `${contact.shortName}: ${meta.ogHeadline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderOgCard({ title: meta.ogHeadline, lines: [meta.ogSubline] });
}
