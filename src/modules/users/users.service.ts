import { Injectable } from "@nestjs/common";

import { type Users } from "@/modules/users/types/users.type";

import type * as userSchema from "@/database/models/auth/users.model";
import { type DatabaseType } from "@/database/types/db.types";

import { type CreateUserDTO } from "./dto/create-user.dto";
import { type UpdateUserDTO } from "./dto/update-user.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDTO: CreateUserDTO, db?: DatabaseType) {
    return await this.usersRepository.create(createUserDTO, db).execute();
  }

  /**
   * The `findAll` function retrieves all records from the `users` in the database.
   * @returns The `findAll()` function is returning the result of the database query, which is a list
   * of all the records from the `users` in the `schema`.
   */
  async getAll(db?: DatabaseType<typeof userSchema>) {
    // TODO: include pagination
    return await this.usersRepository.getAll(db).execute();
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

  async update(updateUserDTO: UpdateUserDTO, id: string, db?: DatabaseType) {
    return this.usersRepository.update(updateUserDTO, db).execute({ id });
  }

  async seed() {}
}
