import { Inject, Injectable } from "@nestjs/common";

import type {
  UsersCountParams,
  UsersListRepoParams,
} from "@/modules/users/dto/users-list.dto";

import {
  DRIZZLE_ASYNC_PROVIDER,
  withPaginate,
} from "@/database/drizzle.service";
import * as schema from "@/database/models";
import { UserRoleEnum, type Users } from "@/database/schemas/users/users.type";
import { type DatabaseType } from "@/database/types/db.type";

import { and, between, countDistinct, eq, ilike, or, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { type CreateUserDTO } from "./dto/create-user.dto";
import { type UpdateUserDTO } from "./dto/update-user.dto";

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  /**
   * The function creates a prepared statement to insert a new user into the database.
   * @param {CreateUserDTO} createUser - An object of type CreateUserDTO, which contains the data
   * needed to create a new user.
   * @returns The `create` function is returning a prepared statement for inserting a new user into the
   * database.
   */
  async create(
    createUser: CreateUserDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .insert(schema.users)
      .values({
        email: createUser.email,
        encrypted_password: createUser.encrypted_password,
        salt: createUser.salt,
        profile_id: createUser.profile_id,
        confirmation_sent_at: createUser.confirmation_sent_at,
        confirmation_token: createUser.confirmation_token,
      })
      .returning();
  }

  async count(
    { "sex[]": sex, from, to, q: query, role }: UsersCountParams,
    db: DatabaseType<typeof schema> = this.db,
  ) {
    return await db
      .select({ value: countDistinct(schema.users.id) })
      .from(schema.users)
      .innerJoin(
        schema.profiles,
        and(
          eq(schema.users.profile_id, schema.profiles.id),
          sex
            ? or(
                ...(typeof sex === "string" ? [sex] : sex).map((s) =>
                  eq(schema.profiles.sex, s),
                ),
              )
            : undefined,
          query ? ilike(schema.users.email, `%${query}%`) : undefined,
          from && to
            ? or(
                between(schema.users.created_at, new Date(from), new Date(to)),
                between(schema.users.updated_at, new Date(from), new Date(to)),
              )
            : undefined,
          role ? eq(schema.users.role, role) : undefined,
        ),
      );
  }

  /**
   * The function `getAll()` retrieves a list of users with their profiles from a database, limited to
   * 50 users.
   * @returns a prepared statement for retrieving users from the database.
   */
  async list({
    limit,
    offset,
    query,
    role,
    sex,
    from,
    to,
    db = this.db,
  }: UsersListRepoParams) {
    return await withPaginate({
      qb: db
        .select({
          id: schema.users.id,
          profile_id: schema.users.profile_id,
          phone: schema.users.phone,
          email: schema.users.email,
          role: schema.users.role,
          banned_at: schema.users.banned_at,
          banned_until: schema.users.banned_until,
          deleted_at: schema.users.deleted_at,
          invited_at: schema.users.invited_at,
          confirmed_at: schema.users.confirmed_at,
          confirmation_sent_at: schema.users.confirmation_sent_at,
          created_at: schema.users.created_at,
          updated_at: schema.users.updated_at,
          profile: schema.profiles,
        })
        .from(schema.users)
        .innerJoin(
          schema.profiles,
          and(
            eq(schema.users.profile_id, schema.profiles.id),
            sex ? or(...sex.map((s) => eq(schema.profiles.sex, s))) : undefined,
            query ? ilike(schema.users.email, `%${query}%`) : undefined,
            from && to
              ? or(
                  between(
                    schema.users.created_at,
                    new Date(from),
                    new Date(to),
                  ),
                  between(
                    schema.users.updated_at,
                    new Date(from),
                    new Date(to),
                  ),
                )
              : undefined,
            role ? eq(schema.users.role, role) : undefined,
          ),
        )
        .$dynamic(),
      limit,
      offset,
      columns: [schema.users.id, schema.profiles.id],
    });
  }

  /**
   * The function retrieves a user from the database based on a specified key.
   * @param  - The `get` function takes an object as its parameter with a property `by` of type `keyof
   * Users`. The `by` property represents the key of the `Users` object that will be used to query the
   * database.
   * @returns The `get` function is returning a prepared statement for retrieving a user from the
   * database based on a specified key.
   */
  get({ by, db }: { by: keyof Users; db?: DatabaseType<typeof schema> }) {
    return (db ?? this.db).query.users
      .findFirst({
        columns: {
          id: true,
          profile_id: true,
          phone: true,
          email: true,
          encrypted_password: true,
          role: true,
          banned_until: true,
          deleted_at: true,
          invited_at: true,
          confirmed_at: true,
          confirmation_token: true,
          confirmation_sent_at: true,
          recovery_sent_at: true,
          recovery_token: true,
          created_at: true,
          updated_at: true,
        },
        with: {
          profile: true,
        },
        where: (users, { eq }) => eq(users[by], sql.placeholder(by)),
      })
      .prepare("get_user_by_id");
  }

  /**
   * The function updates a user in the database with the provided data.
   * @param {UpdateUserDTO} updateUserDTO - The `updateUserDTO` parameter is an object that contains
   * the updated user data. It typically includes properties such as `name`, `email`, `password`, and
   * `role`.
   * @returns a prepared statement for updating a user in the database.
   */
  async update(
    updateUserDTO: UpdateUserDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .update(schema.users)
      .set({
        ...updateUserDTO,
        banned_at: updateUserDTO.banned_at,
        role: updateUserDTO.role ? UserRoleEnum[updateUserDTO.role] : undefined,
      })
      .where(eq(schema.users.id, updateUserDTO.id))
      .returning();
  }

  /**
   * The `delete()` function returns a statement that deletes a user from the database based on their
   * ID.
   * @returns The `delete()` function is returning a statement that deletes a record from the database.
   */
  async delete(db: DatabaseType<typeof schema> = this.db) {
    return db
      .delete(schema.users)
      .where(eq(schema.users.id, sql.placeholder("id")));
  }
}
