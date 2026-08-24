import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/migrate.ts"],
  format: "esm",
  platform: "node",
  target: "node22",
  outDir: "dist",
  clean: true,
  // `type: "module"` already makes .js files ESM — keep the familiar filename
  // so the container command stays `node dist/index.js`.
  outExtensions: () => ({ js: ".js" }),
  deps: {
    // Bundle everything, including this package's own `dependencies`, which
    // tsdown externalizes by default. The runtime image copies `dist/` alone
    // with no `node_modules`, so an external import is a crash at startup --
    // and the workspace packages ship raw TypeScript with extensionless
    // relative imports, which cannot be resolved at runtime either way.
    alwaysBundle: [/.*/],
  },
  // Types are covered by `typecheck`; the build only needs runnable JS.
  dts: false,
});
