// Laat `import "server-only"` in unittests door; buiten Next ontbreekt de
// react-server-conditie. Gebruik:
// npx tsx --require ./tests/unit/server-only-stub.cjs --test tests/unit/**/*.test.ts
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Module = require("node:module");

const originalLoad = Module._load;
Module._load = function load(request, ...rest) {
  if (request === "server-only") return {};
  return originalLoad.call(this, request, ...rest);
};
