import * as schemas from "@/database/models";

import { type SQL } from "drizzle-orm";
import {
  type PgColumn,
  type PgSelect,
  type PgSelectQueryBuilder,
} from "drizzle-orm/pg-core";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { env } from "@/core/env";
import postgres from "postgres";

export const DRIZZLE_ASYNC_PROVIDER = "DRIZZLE_ASYNC_PROVIDER";

// for migrations
export const migrationClient = postgres(env.DATABASE_URL, { max: 10 });

// for query purposes
export const queryClient = postgres(env.DATABASE_URL);
export const db: PostgresJsDatabase<typeof schemas> = drizzle(queryClient, {
  schema: schemas,
});

export function withPaginate<
  T extends PgSelect | PgSelectQueryBuilder = PgSelectQueryBuilder,
>({
  qb,
  limit,
  offset,
  columns,
}: {
  qb: T;
  limit: number;
  offset: number;
  columns: (PgColumn | SQL | SQL.Aliased)[];
}) {
  return qb
    .limit(limit)
    .offset(offset)
    .groupBy(...columns);
}

export const drizzleProvider = {
  provide: DRIZZLE_ASYNC_PROVIDER,
  useFactory: async () => {
    return db;
  },
  export: [DRIZZLE_ASYNC_PROVIDER],
};
