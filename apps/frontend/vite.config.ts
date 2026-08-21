import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  const port = Number(process.env.FRONTEND_PORT ?? 3001);

  // Both apps load the same root `.env`, so the backend's `PORT` is set in this
  // process too — and nitro's dev server reads `process.env.PORT` *ahead of*
  // `server.port` below, which parks the frontend on the backend's port. It
  // fails silently because the two bind different address families. Pin `PORT`
  // before nitro reads it. Dev only: the built server reads `PORT` at runtime,
  // which is how container platforms tell it where to listen.
  if (command === "serve") {
    process.env.PORT = String(port);
  }

  return {
    server: {
      port,
    },
    // Vite resolves tsconfig `paths` natively as of v8 — no plugin needed.
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [nitro(), tanstackStart(), viteReact(), tailwindcss()],
  };
});
