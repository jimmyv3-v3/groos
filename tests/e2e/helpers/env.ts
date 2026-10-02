import { readFileSync } from "node:fs";
import { join } from "node:path";

// Basisgegevens van een e2e-run (spec 14 §4.3).
export const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3100";
export const LOKAAL = new URL(BASE_URL).hostname === "localhost";

type RunInfo = { runId: string; database: boolean };

function runInfo(): RunInfo | null {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), ".playwright-mcp/.auth/run.json"), "utf8")) as RunInfo;
  } catch {
    return null;
  }
}

export const RUN_ID: string = runInfo()?.runId ?? "lokaal";

/** delivered+e2e-<RUN_ID>-<label>@resend.dev */
export function testEmail(label: string): string {
  return `delivered+e2e-${RUN_ID}-${label}@resend.dev`;
}
