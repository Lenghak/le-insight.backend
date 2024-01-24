import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as refreshTokenSchema from "@/database/models/auth/refresh-tokens.model";
import type * as userSchema from "@/database/models/auth/users.model";
import { type DatabaseType } from "@/database/types/db.types";

import { and, eq, isNotNull, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { type UpdateRefreshTokensDTO } from "./dto/update-refresh-tokens.dto";

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<
      typeof refreshTokenSchema & typeof userSchema
    >,
  ) {}

  create(db?: DatabaseType) {
    return (db ?? this.db)
      .insert(refreshTokenSchema.refreshTokens)
      .values({
        user_id: sql.placeholder("userID"),
        session_id: sql.placeholder("sessionID"),
        token: sql.placeholder("token"),
      })
      .returning()
      .prepare("insert_refresh_token");
  }

  /**
   * The function updates the token value of a refresh token in the database based on the provided user
   * ID.
   * @param {UpdateRefreshTokensDTO} updateRefreshTokensDTO - The `updateRefreshTokensDTO` parameter is
   * an object that contains the following properties:
   * @returns The prepared statement "update_refresh_token" is being returned.
   */
  update(updateRefreshTokensDTO: UpdateRefreshTokensDTO, db?: DatabaseType) {
    return (db ?? this.db)
      .update(refreshTokenSchema.refreshTokens)
      .set({ token: updateRefreshTokensDTO.token })
      .where(
        eq(refreshTokenSchema.refreshTokens.user_id, sql.placeholder("userID")),
      )
      .returning()
      .prepare("update_refresh_token");
  }

  delete(db?: DatabaseType) {
    return (db ?? this.db)
      .update(refreshTokenSchema.refreshTokens)
      .set({ token: null })
      .where(
        and(
          isNotNull(refreshTokenSchema.refreshTokens.user_id),
          eq(
            refreshTokenSchema.refreshTokens.user_id,
            sql.placeholder("userId"),
          ),
        ),
      )
      .returning()
      .prepare("delete_refresh_token");
  }
}
