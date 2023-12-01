import * as schemas from "@/database/models";

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "../core/env";

export const DRIZZLE_ASYNC_PROVIDER = "DRIZZLE_ASYNC_PROVIDER";

// for migrations
export const migrationClient = postgres(env().DATABASE_URL, { max: 1 });

// for query purposes
export const queryClient = postgres(env().DATABASE_URL);
export const db: PostgresJsDatabase<typeof schemas> = drizzle(queryClient, {
  schema: schemas,
});

export const drizzleProvider = {
  provide: DRIZZLE_ASYNC_PROVIDER,
  useFactory: async () => {
    return db;
  },
  export: [DRIZZLE_ASYNC_PROVIDER],
};
