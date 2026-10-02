import { execFileSync } from "node:child_process";

/** Ruimt na een lokale run alle e2e-data op (spec 14 §5.5). */
export default function globalTeardown(): void {
  execFileSync(process.execPath, ["scripts/e2e-opruimen.mjs"], { stdio: "inherit" });
}
