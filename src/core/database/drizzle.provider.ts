import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "../env";

export const DRIZZLE_ASYNC_PROVIDER = "DRIZZLE_ASYNC_PROVIDER";

export const drizzleProvider = {
  provide: DRIZZLE_ASYNC_PROVIDER,
  useFactory: async () => {
    // for migrations
    const migrationClient = postgres(env().DATABASE_URL, { max: 1 });

    // for query purposes
    const queryClient = postgres(env().DATABASE_URL);
    const db = drizzle(queryClient);

    return {
      migrationClient,
      queryClient,
      db,
    };
  },
  export: [DRIZZLE_ASYNC_PROVIDER],
};
