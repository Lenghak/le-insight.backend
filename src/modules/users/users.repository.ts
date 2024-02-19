import { Inject, Injectable } from "@nestjs/common";

import {
  DRIZZLE_ASYNC_PROVIDER,
  withPaginate,
} from "@/database/drizzle.service";
import * as userSchema from "@/database/models/auth/users.model";
import * as profileSchema from "@/database/models/profiles.model";
import {
  UserRoleEnum,
  type Users,
} from "@/database/schemas/auth/users/users.type";
import { type DatabaseType } from "@/database/types/db.type";

import { countDistinct, eq, ilike, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { type CreateUserDTO } from "./dto/create-user.dto";
import { type UpdateUserDTO } from "./dto/update-user.dto";

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof userSchema>,
  ) {}

  /**
   * The function creates a prepared statement to insert a new user into the database.
   * @param {CreateUserDTO} createUser - An object of type CreateUserDTO, which contains the data
   * needed to create a new user.
   * @returns The `create` function is returning a prepared statement for inserting a new user into the
   * database.
   */
  create(
    createUser: CreateUserDTO,
    db: DatabaseType | DatabaseType<typeof userSchema> = this.db,
  ) {
    return db
      .insert(userSchema.users)
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

  async count(query?: string, db: DatabaseType<typeof userSchema> = this.db) {
    return await db
      .select({ value: countDistinct(userSchema.users.id) })
      .from(userSchema.users)
      .where(query ? ilike(userSchema.users.email, `%${query}%`) : undefined);
  }

  /**
   * The function `getAll()` retrieves a list of users with their profiles from a database, limited to
   * 50 users.
   * @returns a prepared statement for retrieving users from the database.
   */
  async list(
    limit: number,
    offset: number,
    query?: string,
    db: DatabaseType | DatabaseType<typeof userSchema> = this.db,
  ) {
    return await withPaginate(
      db
        .select({
          id: userSchema.users.id,
          profile_id: userSchema.users.profile_id,
          phone: userSchema.users.phone,
          email: userSchema.users.email,
          role: userSchema.users.role,
          banned_until: userSchema.users.banned_until,
          deleted_at: userSchema.users.deleted_at,
          invited_at: userSchema.users.invited_at,
          confirmed_at: userSchema.users.confirmed_at,
          confirmation_sent_at: userSchema.users.confirmation_sent_at,
          created_at: userSchema.users.created_at,
          updated_at: userSchema.users.updated_at,
          profile: profileSchema.profiles,
        })
        .from(userSchema.users)
        .leftJoin(
          profileSchema.profiles,
          eq(userSchema.users.profile_id, profileSchema.profiles.id),
        )
        .$dynamic(),
      limit,
      offset,
      userSchema.users.id,
      profileSchema.profiles.id,
    ).where(query ? ilike(userSchema.users.email, `%${query}%`) : undefined);
  }

  /**
   * The function retrieves a user from the database based on a specified key.
   * @param  - The `get` function takes an object as its parameter with a property `by` of type `keyof
   * Users`. The `by` property represents the key of the `Users` object that will be used to query the
   * database.
   * @returns The `get` function is returning a prepared statement for retrieving a user from the
   * database based on a specified key.
   */
  get({ by, db }: { by: keyof Users; db?: DatabaseType<typeof userSchema> }) {
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
  update(
    updateUserDTO: UpdateUserDTO,
    db: DatabaseType | DatabaseType<typeof userSchema> = this.db,
  ) {
    return db
      .update(userSchema.users)
      .set({
        ...updateUserDTO,
        role: updateUserDTO.role ? UserRoleEnum[updateUserDTO.role] : undefined,
      })
      .where(eq(userSchema.users.id, updateUserDTO.id))
      .returning();
  }

  /**
   * The `delete()` function returns a statement that deletes a user from the database based on their
   * ID.
   * @returns The `delete()` function is returning a statement that deletes a record from the database.
   */
  delete(db: DatabaseType<typeof userSchema> = this.db) {
    return db
      .delete(userSchema.users)
      .where(eq(userSchema.users.id, sql.placeholder("id")));
  }
}
