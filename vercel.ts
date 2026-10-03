import type { VercelConfig } from "@vercel/config/v1";

// Projectconfiguratie voor Vercel (spec 13 §4.3). Cron-tijden zijn UTC; Vercel
// Cron draait alleen op productie en stuurt "Authorization: Bearer <CRON_SECRET>".
// De routes staan in app/api/cron/* (spec 10 §4.6); elke path heeft daar een
// route.ts. Elk kwartier draaien vraagt Vercel Pro.
// Default export: de build van Vercel leest eerst `default` en dan `config`;
// `npx @vercel/config validate` leest alleen de default export plat in.
const config: VercelConfig = {
  framework: "nextjs",
  regions: ["fra1"],
  crons: [
    { path: "/api/cron/vacatures", schedule: "*/15 * * * *" },
    { path: "/api/cron/bewaartermijnen", schedule: "0 2 * * *" },
    { path: "/api/cron/opruimen", schedule: "30 2 * * *" },
  ],
};

export default config;
