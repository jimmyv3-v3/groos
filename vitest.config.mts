import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import { fileURLToPath } from "node:url";

// Unit- en integratieconfiguratie (spec 14 §4.2). Vitest-bestanden eindigen op
// .test.ts, Playwright-bestanden op .spec.ts, zodat de runners elkaar niet raken.
export default defineConfig({
  resolve: {
    tsconfigPaths: true, // Vite 8: het pad-alias @/* uit tsconfig.json
    // "server-only" gooit buiten de react-server-omgeving een fout.
    alias: { "server-only": fileURLToPath(new URL("./tests/unit/stubs/server-only.ts", import.meta.url)) },
  },
  test: {
    projects: [
      { extends: true, test: { name: "unit", include: ["tests/unit/**/*.test.ts"], environment: "node" } },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          environment: "node",
          env: loadEnv("development", process.cwd(), ""),
          fileParallelism: false,
          testTimeout: 30_000,
          globalSetup: ["tests/integration/bewaking.ts"],
        },
      },
    ],
  },
});
