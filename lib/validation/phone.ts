/**
 * Telefoonnummers (spec 07 §5.3). Client-veilig, zonder extra package.
 */

/** Zet invoer om naar E.164, of null als het geen geldig nummer is. */
export function normalizePhone(input: string): `+${string}` | null {
  let value = input.replace(/[\s.\-()/]/g, "");
  if (value.startsWith("00")) value = `+${value.slice(2)}`;

  if (value.startsWith("+")) {
    if (value.startsWith("+310")) value = `+31${value.slice(4)}`;
    if (!/^\+[1-9][0-9]{7,14}$/.test(value)) return null;
    if (value.startsWith("+31") && !/^\+31[1-9][0-9]{8}$/.test(value)) return null;
    return value as `+${string}`;
  }
  if (/^0[1-9][0-9]{8}$/.test(value)) return `+31${value.slice(1)}`;
  if (/^6[0-9]{8}$/.test(value)) return `+31${value}`;
  return null;
}

/** Leesbare notatie: 06 12 34 56 78, 070 123 45 67, 010 123 456 7 of +48 512345678. */
export function formatPhoneDisplay(e164: string): string {
  if (/^\+316[0-9]{8}$/.test(e164)) {
    const d = e164.slice(4);
    return `06 ${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 6)} ${d.slice(6, 8)}`;
  }
  if (/^\+3170[0-9]{7}$/.test(e164)) {
    const d = e164.slice(5);
    return `070 ${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 7)}`;
  }
  if (/^\+31[0-9]{9}$/.test(e164)) {
    const d = e164.slice(3);
    return `0${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
  }
  const digits = e164.slice(1);
  if (!/^[0-9]{8,15}$/.test(digits)) return e164;
  const cc = countryCodeLength(digits);
  return `+${digits.slice(0, cc)} ${digits.slice(cc)}`;
}

/** Lengte van de landcode volgens de nummerplannen van de ITU (1, 2 of 3 cijfers). */
function countryCodeLength(digits: string): number {
  if (digits[0] === "1" || digits[0] === "7") return 1;
  const two = digits.slice(0, 2);
  const twoDigit = /^(20|27|3[0-469]|4[013-9]|5[1-8]|6[0-6]|8[1246]|9[0-58])$/;
  return twoDigit.test(two) ? 2 : 3;
}
