import { createHmac } from "node:crypto";

// TOTP volgens RFC 6238 (spec 14 §4.3); geen extra pakket nodig. Ook gebruikt
// door scripts/e2e-voorbereiden.mjs (Node 24 laadt .ts met type stripping).

const ALFABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32NaarBuffer(invoer: string): Buffer {
  const schoon = invoer.replace(/=+$/, "").replace(/\s/g, "").toUpperCase();
  let bits = "";
  for (const teken of schoon) {
    const waarde = ALFABET.indexOf(teken);
    if (waarde < 0) throw new Error(`Ongeldig base32-teken: ${teken}`);
    bits += waarde.toString(2).padStart(5, "0");
  }
  return Buffer.from((bits.match(/.{8}/g) ?? []).map((b) => parseInt(b, 2)));
}

export function totp(geheim: string, nu = Date.now()): string {
  const teller = Buffer.alloc(8);
  teller.writeBigUInt64BE(BigInt(Math.floor(nu / 1000 / 30)));
  const hmac = createHmac("sha1", base32NaarBuffer(geheim)).update(teller).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  return ((hmac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).toString().padStart(6, "0");
}

/** Wacht tot het volgende venster als er minder dan `minSeconden` over zijn. */
export async function wachtOpVerseCode(minSeconden = 5): Promise<void> {
  const over = 30 - (Math.floor(Date.now() / 1000) % 30);
  if (over < minSeconden) await new Promise((r) => setTimeout(r, over * 1000 + 250));
}
