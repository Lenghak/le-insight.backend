import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as refreshTokenSchema from "@/database/models/refresh-tokens/refresh-tokens.model";
import type * as userSchema from "@/database/models/users";
import { type RefreshTokens } from "@/database/schemas/refresh-tokens/refresh-tokens.type";
import { type DatabaseType } from "@/database/types/db.type";

import { and, eq, isNotNull, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import bcrypt from "bcrypt";

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<
      typeof refreshTokenSchema & typeof userSchema
    >,
  ) {}

  get({
    by,
    db,
  }: {
    by: keyof RefreshTokens;
    db?: DatabaseType<typeof refreshTokenSchema>;
  }) {
    return (db ?? this.db).query.refreshTokens
      .findFirst({
        where: (refreshTokens, { eq }) =>
          eq(refreshTokens[by], sql.placeholder(by)),
      })
      .prepare("get_refresh_token");
  }

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
  update(token: string, db?: DatabaseType) {
    return (db ?? this.db)
      .update(refreshTokenSchema.refreshTokens)
      .set({ token: token })
      .where(
        and(
          eq(
            refreshTokenSchema.refreshTokens.user_id,
            sql.placeholder("userID"),
          ),
          eq(
            refreshTokenSchema.refreshTokens.session_id,
            sql.placeholder("sessionID"),
          ),
        ),
      )
      .returning()
      .prepare("update_refresh_token");
  }

  delete(db?: DatabaseType) {
    return (db ?? this.db)
      .delete(refreshTokenSchema.refreshTokens)
      .where(
        and(
          isNotNull(refreshTokenSchema.refreshTokens.token),
          eq(
            refreshTokenSchema.refreshTokens.user_id,
            sql.placeholder("userID"),
          ),
          eq(
            refreshTokenSchema.refreshTokens.session_id,
            sql.placeholder("sessionID"),
          ),
        ),
      )
      .returning()
      .prepare("delete_refresh_token");
  }

  async hashRefreshToken(token: string) {
    return await bcrypt.hash(token, 12);
  }
}
