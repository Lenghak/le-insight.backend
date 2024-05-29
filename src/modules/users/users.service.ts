import { Injectable } from "@nestjs/common";

import paginationHelper from "@/common/helpers/pagination.helper";

import { type Users } from "@/database/schemas/users/users.type";
import { type DatabaseType } from "@/database/types/db.type";

import { type CreateUserDTO } from "./dto/create-user.dto";
import { type UpdateUserDTO } from "./dto/update-user.dto";
import { type UsersCountParams, type UsersListDTO } from "./dto/users-list.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDTO: CreateUserDTO, db: DatabaseType) {
    return await this.usersRepository.create(createUserDTO, db);
  }

  /**
   * The `findAll` function retrieves all records from the `users` in the database.
   * @returns The `findAll()` function is returning the result of the database query, which is a list
   * of all the records from the `users` in the `schema`.
   */
  async list(
    { limit = 50, page = 1, q, "sex[]": sex, ...params }: UsersListDTO,
    db?: DatabaseType,
  ) {
    const count = (
      await this.usersRepository.count({
        q,
        "sex[]": sex,
        ...params,
      })
    )[0].value;
    const { hasNextPage, hasPreviousPage, offset, totalPages } =
      paginationHelper({ count, page, limit });

    const users = await this.usersRepository.list({
      limit,
      offset,
      query: q,
      sex: typeof sex === "string" ? [sex] : sex,
      db,
      ...params,
    });

    return {
      data: users,
      meta: {
        count,
        page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  /**
   * The function `get` retrieves data from the `usersRepository` based on the specified criteria.
   * @param  - - `by` is a property of type `keyof Users`, which means it can be any key of the `Users`
   * type.
   * @returns The code is returning the result of executing the `get` method on the `usersRepository`
   * object.
   */
  async get({
    by,
    values,
  }: {
    by: keyof Users;
    values: Record<string, unknown>;
  }) {
    return await this.usersRepository.get({ by }).execute(values);
  }

  async update(updateUserDTO: UpdateUserDTO, db?: DatabaseType) {
    return await this.usersRepository.update(updateUserDTO, db);
  }

  async count(params: UsersCountParams) {
    return await this.usersRepository.count(params);
  }
}
