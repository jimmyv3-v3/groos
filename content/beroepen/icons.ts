import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock,
  CloudSun,
  Euro,
  FileText,
  GraduationCap,
  HardHat,
  Handshake,
  MessageCircle,
  Moon,
  Phone,
  Receipt,
  Route,
  ShieldCheck,
  Sun,
  Sunrise,
  Truck,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";

/**
 * Iconen voor kaarten in content/beroepen en content/pages (spec 05 §5.2).
 * Geen tekst, client-veilig. De sleutels na `route` zijn een aanvulling van de
 * bouw-agent voor werktijden en de overzichtspagina's.
 */
export const BEROEP_ICONS = {
  calendar: CalendarDays,
  weather: CloudSun,
  clock: Clock,
  safety: HardHat,
  handshake: Handshake,
  phone: Phone,
  payslip: Receipt,
  shield: ShieldCheck,
  season: Sun,
  transport: Truck,
  team: Users,
  tools: Wrench,
  wage: Euro,
  route: Route,
  early: Sunrise,
  evening: Moon,
  document: FileText,
  message: MessageCircle,
  learn: GraduationCap,
  person: UserCheck,
  building: Building2,
  check: BadgeCheck,
} as const;

export type BeroepIcon = keyof typeof BEROEP_ICONS;
