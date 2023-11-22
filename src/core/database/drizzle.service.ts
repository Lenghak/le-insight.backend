import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "../env";

export const DRIZZLE_ASYNC_PROVIDER = "DRIZZLE_ASYNC_PROVIDER";

// for migrations
export const migrationClient = postgres(env().DATABASE_URL, { max: 1 });

// for query purposes
export const queryClient = postgres(env().DATABASE_URL);
export const db = drizzle(queryClient);

export const drizzleProvider = {
  provide: DRIZZLE_ASYNC_PROVIDER,
  useFactory: async () => {
    return db;
  },
  export: [DRIZZLE_ASYNC_PROVIDER],
};
