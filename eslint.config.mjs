import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next.js 16 heeft `next lint` geschrapt; lint draait via de ESLint-CLI
// (`npm run lint`). In J. Versseput faalde lint om die reden.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Playwright-fixtures heten `use`; die zijn geen React-hooks (spec 14 §4.2).
  { files: ["tests/**"], rules: { "react-hooks/rules-of-hooks": "off" } },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "context/**", ".claude/**"]),
]);

export default eslintConfig;
