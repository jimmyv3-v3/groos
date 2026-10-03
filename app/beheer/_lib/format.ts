/**
 * Notatie voor het beheer (spec 08 §4.2). Client-veilig. Bedragen en datums
 * zonder tijd gaan via formatEuro en formatDate uit lib/format.ts.
 */

const TZ = "Europe/Amsterdam";

/** +31612345678 -> "06 12 34 56 78"; +31701234567 -> "070 123 4567"; buitenland in groepen van 3. */
export function formatPhoneNl(e164: string): string {
  if (e164.startsWith("+31")) {
    const national = `0${e164.slice(3)}`;
    if (/^06\d{8}$/.test(national)) {
      return `${national.slice(0, 2)} ${national.slice(2, 4)} ${national.slice(4, 6)} ${national.slice(6, 8)} ${national.slice(8)}`;
    }
    // Netnummers van twee cijfers (010, 020, 030, 040, 050, 070) of drie cijfers.
    const twoDigitArea = /^0(10|20|30|33|35|36|38|40|43|45|46|50|53|55|58|70|71|72|73|74|75|76|77|78|79)/.test(national);
    const areaLength = twoDigitArea ? 3 : 4;
    const area = national.slice(0, areaLength);
    const rest = national.slice(areaLength);
    return rest.length > 4 ? `${area} ${rest.slice(0, rest.length - 4)} ${rest.slice(-4)}` : `${area} ${rest}`;
  }
  const match = /^\+(\d{1,3})(\d+)$/.exec(e164);
  if (!match) return e164;
  const groups = match[2].match(/.{1,3}/g) ?? [];
  return `+${match[1]} ${groups.join(" ")}`;
}

/** https://wa.me/31612345678?text=<encodeURIComponent> */
export function whatsappHref(e164: string, text: string): string {
  return `https://wa.me/${e164.replace(/^\+/, "")}?text=${encodeURIComponent(text)}`;
}

export function telHref(e164: string): `tel:${string}` {
  return `tel:${e164}`;
}

export function mailtoHref(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

function parts(date: Date): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat("nl-NL", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)) {
    out[p.type] = p.value;
  }
  return out;
}

/** "14.05" in Amsterdamse tijd. */
export function formatTimeNl(iso: string | Date): string {
  const p = parts(new Date(iso));
  return `${p.hour}.${p.minute}`;
}

/** "2 oktober 2026" in Amsterdamse tijd. */
export function formatDateNl(iso: string | Date): string {
  return new Intl.DateTimeFormat("nl-NL", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}

/** "2 oktober 2026, 14.05 uur" (Europe/Amsterdam). */
export function formatDateTimeNl(iso: string): string {
  return `${formatDateNl(iso)}, ${formatTimeNl(iso)} uur`;
}

/** YYYY-MM-DD van een moment in Amsterdamse tijd. */
export function amsterdamDateKey(date: Date): string {
  const p = parts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

/** "vandaag 09.12 uur", "gisteren 16.40 uur", "3 dagen geleden", daarna de datum. */
export function formatRelativeNl(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const dayMs = 24 * 60 * 60 * 1000;
  const key = amsterdamDateKey(date);
  const today = amsterdamDateKey(now);
  if (key === today) return `vandaag ${formatTimeNl(date)} uur`;
  if (key === amsterdamDateKey(new Date(now.getTime() - dayMs))) return `gisteren ${formatTimeNl(date)} uur`;
  const days = Math.round((Date.parse(`${today}T12:00:00Z`) - Date.parse(`${key}T12:00:00Z`)) / dayMs);
  if (days > 1 && days < 7) return `${days} dagen geleden`;
  return formatDateNl(date);
}

/** Verschil in minuten tussen Amsterdamse wandkloktijd en UTC op dat moment. */
function amsterdamOffsetMinutes(date: Date): number {
  const p = parts(date);
  const asUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute));
  return Math.round((asUtc - Math.floor(date.getTime() / 60000) * 60000) / 60000);
}

/** "2026-10-05T07:00" -> ISO in UTC met de juiste zomer- of wintertijd. */
export function amsterdamLocalToIso(local: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local);
  if (!match) throw new Error("invalid_local_datetime");
  const [, y, mo, d, h, mi] = match.map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  let offset = amsterdamOffsetMinutes(new Date(guess));
  let result = guess - offset * 60000;
  // Tweede ronde voor de nacht van de klokwissel.
  offset = amsterdamOffsetMinutes(new Date(result));
  result = guess - offset * 60000;
  return new Date(result).toISOString();
}

/** "2026-11-16" -> ISO van 23.59 uur Amsterdamse tijd. */
export function amsterdamDateEndToIso(date: string): string {
  return amsterdamLocalToIso(`${date}T23:59`);
}

/** Voor <input type="datetime-local">: "2026-10-05T07:00". */
export function isoToAmsterdamLocal(iso: string): string {
  const p = parts(new Date(iso));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** Slaat zaterdag en zondag over. */
export function subtractWorkdays(date: Date, days: number): Date {
  const result = new Date(date);
  let left = days;
  while (left > 0) {
    result.setUTCDate(result.getUTCDate() - 1);
    const day = result.getUTCDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return result;
}

/** Voor 12.00, 12.00 tot 18.00, vanaf 18.00 (Amsterdam). */
export function greetingKey(now: Date = new Date()): "morning" | "afternoon" | "evening" {
  const hour = Number(parts(now).hour);
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

/** "1,2 MB" of "340 kB". */
export function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return new Intl.NumberFormat("nl-NL", { style: "unit", unit: "megabyte", maximumFractionDigits: 1 }).format(mb);
  }
  return new Intl.NumberFormat("nl-NL", { style: "unit", unit: "kilobyte", maximumFractionDigits: 0 }).format(
    Math.max(1, Math.round(bytes / 1024)),
  );
}
