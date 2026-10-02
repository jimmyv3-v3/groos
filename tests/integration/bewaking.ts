// globalSetup van het Vitest-project integration (spec 14 §5.2): weigert elk
// Supabase-project dat niet in tests/e2e/toegestane-projecten.json staat.
// globalSetup draait in het hoofdproces, dus .env.local wordt hier zelf geladen.
import { controleerTestproject, laadEnv } from "../../scripts/lib/testomgeving.mjs";

export default function setup(): void {
  laadEnv();
  controleerTestproject(process.env.NEXT_PUBLIC_SUPABASE_URL);
}
