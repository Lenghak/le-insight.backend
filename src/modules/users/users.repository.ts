import { Inject, Injectable } from "@nestjs/common";

import { UserRoleEnum } from "@/modules/users/types/users.enum";
import { type Users } from "@/modules/users/types/users.type";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models/auth/users.schema";

import { eq, sql } from "drizzle-orm";
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
   * The function `getAll()` retrieves a list of users with their profiles from a database, limited to
   * 50 users.
   * @returns a prepared statement for retrieving users from the database.
   */
  getAll() {
    const statement = this.db.query.users
      .findMany({
        columns: {
          id: true,
          profile_id: true,
          phone: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
        limit: 50,
        with: {
          profile: true,
        },
      })
      .prepare("get_users");

    return statement;
  }

  /**
   * The function retrieves a user from the database based on a specified key.
   * @param  - The `get` function takes an object as its parameter with a property `by` of type `keyof
   * Users`. The `by` property represents the key of the `Users` object that will be used to query the
   * database.
   * @returns The `get` function is returning a prepared statement for retrieving a user from the
   * database based on a specified key.
   */
  get({ by }: { by: keyof Users }) {
    const statement = this.db.query.users
      .findFirst({
        with: {
          profile: true,
        },
        where: (users, { eq }) => eq(users[by], sql.placeholder(by)),
      })
      .prepare("get_user_by_id");

    return statement;
  }

  /**
   * The function creates a prepared statement to insert a new user into the database.
   * @param {CreateUserDTO} createUser - An object of type CreateUserDTO, which contains the data
   * needed to create a new user.
   * @returns The `create` function is returning a prepared statement for inserting a new user into the
   * database.
   */
  create(createUser: CreateUserDTO) {
    const statement = this.db
      .insert(schema.users)
      .values({
        email: createUser.email,
        encrypted_password: createUser.password,
        salt: createUser.salt,
        profile_id: createUser.profileID,
      })
      .returning()
      .prepare("insert_user");

    return statement;
  }

  /**
   * The function updates a user in the database with the provided data.
   * @param {UpdateUserDTO} updateUserDTO - The `updateUserDTO` parameter is an object that contains
   * the updated user data. It typically includes properties such as `name`, `email`, `password`, and
   * `role`.
   * @returns a prepared statement for updating a user in the database.
   */
  update(updateUserDTO: UpdateUserDTO) {
    const statement = this.db
      .update(schema.users)
      .set({
        ...updateUserDTO,
        role: UserRoleEnum[updateUserDTO.role] ?? undefined,
      })
      .where(eq(schema.users.id, sql.placeholder("id")))
      .prepare("update_user");

    return statement;
  }

  /**
   * The `delete()` function returns a statement that deletes a user from the database based on their
   * ID.
   * @returns The `delete()` function is returning a statement that deletes a record from the database.
   */
  delete() {
    const statement = this.db
      .delete(schema.users)
      .where(eq(schema.users.id, sql.placeholder("id")));

    return statement;
  }
}
