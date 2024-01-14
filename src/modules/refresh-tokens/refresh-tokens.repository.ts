import { Inject, Injectable } from "@nestjs/common";

import { type SignOutDTO } from "@/modules/auth/dto/sign-out.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as refreshTokenSchema from "@/database/models/auth/refresh-tokens.schema";
import type * as userSchema from "@/database/models/auth/users.schema";

import { and, eq, not } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { type CreateRefreshTokensDTO } from "./dto/create-refresh-tokens.dto";
import { type UpdateRefreshTokensDTO } from "./dto/update-refresh-tokens.dto";

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<
      typeof refreshTokenSchema & typeof userSchema
    >,
  ) {}

  create(createRefreshTokensDTO: CreateRefreshTokensDTO) {
    return this.db
      .insert(refreshTokenSchema.refreshTokens)
      .values(createRefreshTokensDTO)
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
  update(updateRefreshTokensDTO: UpdateRefreshTokensDTO) {
    return this.db
      .update(refreshTokenSchema.refreshTokens)
      .set({ token: updateRefreshTokensDTO.token })
      .where(
        eq(
          refreshTokenSchema.refreshTokens.user_id,
          updateRefreshTokensDTO.userID,
        ),
      )
      .returning()
      .prepare("update_refresh_token");
  }

  delete(signOutDTO: SignOutDTO) {
    return this.db
      .update(refreshTokenSchema.refreshTokens)
      .set({ token: null })
      .where(
        and(
          not(eq(refreshTokenSchema.refreshTokens.user_id, null)),
          eq(refreshTokenSchema.refreshTokens.user_id, signOutDTO.userID),
        ),
      )
      .returning()
      .prepare("delete_refresh_token");
  }
}
