import { type ExtractTablesWithRelations } from "drizzle-orm";
import { type PgTransaction } from "drizzle-orm/pg-core";
import {
  type PostgresJsDatabase,
  type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";

export type DatabaseType<
  TSchema extends Record<string, unknown> = Record<string, never>,
> =
  | PostgresJsDatabase<TSchema>
  | PgTransaction<
      PostgresJsQueryResultHKT,
      TSchema,
      ExtractTablesWithRelations<TSchema>
    >;
