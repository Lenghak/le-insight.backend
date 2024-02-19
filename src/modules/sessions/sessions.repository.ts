import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as sessionSchema from "@/database/models/auth/sessions.model";
import { type DatabaseType } from "@/database/types/db.type";

import { eq, sql } from "drizzle-orm";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class SessionsRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof sessionSchema>,
  ) {}

  create(db?: DatabaseType) {
    return (db ?? this.db)
      .insert(sessionSchema.sessions)
      .values({
        user_id: sql.placeholder<"userID">("userID"),
        ip: sql.placeholder<"ip">("ip"),
        not_after: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user_agent: sql.placeholder<"userAgent">("userAgent"),
      })
      .returning()
      .prepare("insert_session");
  }

  delete(db?: DatabaseType) {
    return (db ?? this.db)
      .delete(sessionSchema.sessions)
      .where(eq(sessionSchema.sessions.id, sql.placeholder("sessionID")))
      .returning()
      .prepare("delete_session");
  }
}
