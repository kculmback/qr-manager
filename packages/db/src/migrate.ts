import { migrate } from "drizzle-orm/node-postgres/migrator";

import { createDb } from "./client";

/**
 * Applies any pending SQL migrations, then closes the connection.
 *
 * Safe to run repeatedly — drizzle records which migrations have already been
 * applied in a `__drizzle_migrations` table and skips them.
 */
export async function runMigrations(
  connectionString: string,
  migrationsFolder: string,
) {
  const db = createDb(connectionString);
  try {
    await migrate(db, { migrationsFolder });
  } finally {
    await db.$client.end();
  }
}
