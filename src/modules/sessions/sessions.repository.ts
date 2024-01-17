import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as sessionSchemas from "@/database/models/auth/sessions.schema";

import { type ExtractTablesWithRelations, sql } from "drizzle-orm";
import { type PgTransaction } from "drizzle-orm/pg-core";
import {
  type PostgresJsDatabase,
  type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";

@Injectable()
export class SessionsRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof sessionSchemas>,
  ) {}

  create(
    db?:
      | PostgresJsDatabase
      | PgTransaction<
          PostgresJsQueryResultHKT,
          Record<string, never>,
          ExtractTablesWithRelations<Record<string, never>>
        >,
  ) {
    return (db ?? this.db)
      .insert(sessionSchemas.sessions)
      .values({
        user_id: sql.placeholder<"userID">("userID"),
        ip: sql.placeholder<"ip">("ip"),
        not_after: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user_agent: sql.placeholder<"userAgent">("userAgent"),
      })
      .returning()
      .prepare("insert_session");
  }
}
