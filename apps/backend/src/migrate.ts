import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runMigrations } from "@qr-manager/db/migrate";

import { env } from "./env.js";

const here = path.dirname(fileURLToPath(import.meta.url));

// Works whether this runs from source via tsx, or from the built bundle — in
// the Docker image the SQL is copied next to it, in the repo it lives in the
// db package.
const candidates = [
  env.MIGRATIONS_DIR,
  path.join(here, "drizzle"),
  path.join(here, "../../../packages/db/drizzle"),
].filter((dir): dir is string => dir !== undefined);

const migrationsFolder = candidates.find((dir) => existsSync(dir));

if (!migrationsFolder) {
  throw new Error(
    `No migrations folder found. Looked in:\n${candidates.map((dir) => `  - ${dir}`).join("\n")}\n` +
      `Run \`pnpm db:generate\` first, or set MIGRATIONS_DIR.`,
  );
}

console.log(`Applying migrations from ${migrationsFolder}`);
await runMigrations(env.POSTGRES_URL, migrationsFolder);
console.log("Migrations up to date");
