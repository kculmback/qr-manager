import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "./schema";

export type Db = ReturnType<typeof createDb>;

export function createDb(connectionString: string) {
  return drizzle({
    client: new Pool({ connectionString }),
    schema,
    casing: "snake_case",
  });
}
