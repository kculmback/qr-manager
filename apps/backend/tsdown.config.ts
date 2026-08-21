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
    // The workspace packages ship raw TypeScript with extensionless relative
    // imports, so they have to be bundled in rather than left as externals.
    alwaysBundle: [/^@qr-manager\//],
  },
  // Types are covered by `typecheck`; the build only needs runnable JS.
  dts: false,
});
