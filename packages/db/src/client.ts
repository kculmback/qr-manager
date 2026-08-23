import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export type Db = ReturnType<typeof createDb>;

/**
 * An open transaction. Distinct from `Db` on purpose: a helper that takes this
 * cannot be called outside one, which is how multi-statement writes are kept
 * atomic without every caller remembering to wrap them.
 */
export type Transaction = Parameters<Parameters<Db["transaction"]>[0]>[0];

/** Anything a query can run against -- the pool itself, or a transaction. */
export type Reader = Db | Transaction;

export function createDb(connectionString: string) {
  return drizzle({
    client: new Pool({ connectionString }),
    schema,
    casing: "snake_case",
  });
}
