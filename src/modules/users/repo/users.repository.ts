import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models";

import { UserRoleEnum } from "@/common/types/modules/user.enum";
import { type Users } from "@/common/types/modules/user.types";
import { eq, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { type CreateUserDTO } from "../dto/create-user.dto";
import { type UpdateUserDTO } from "../dto/update-user.dto";

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  getAll() {
    const statement = this.db.query.users
      .findMany({
        columns: {},
        limit: 50,
        with: {
          profile: true,
        },
      })
      .prepare("get_users");

    return statement;
  }

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

  create(createUser: CreateUserDTO) {
    const statement = this.db
      .insert(schema.users)
      .values(createUser)
      .prepare("insert_user");

    return statement;
  }

  update(updateUserDTO: UpdateUserDTO) {
    const statement = this.db
      .update(schema.users)
      .set({ ...updateUserDTO, role: UserRoleEnum[updateUserDTO.role] })
      .where(eq(schema.users.id, sql.placeholder("id")))
      .prepare("update_user");

    return statement;
  }

  delete() {
    const statement = this.db
      .delete(schema.users)
      .where(eq(schema.users.id, sql.placeholder("id")));

    return statement;
  }
}
