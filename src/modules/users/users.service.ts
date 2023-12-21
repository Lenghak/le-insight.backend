import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { type CreateUserDTO } from "./dto/create-user.dto";
import { type UpdateUserDTO } from "./dto/update-user.dto";
import { UsersRepository } from "./repo/users.repository";

@Injectable()
export class UsersService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDTO: CreateUserDTO) {
    return await this.usersRepository.create(createUserDTO).execute();
  }

  /**
   * The `findAll` function retrieves all records from the `users` in the database.
   * @returns The `findAll()` function is returning the result of the database query, which is a list
   * of all the records from the `users` in the `schema`.
   */
  async findAll() {
    // TODO: include pagination
    return await this.usersRepository.getAll().execute();
  }

  async update(updateUserDTO: UpdateUserDTO, id: string) {
    return this.usersRepository.update(updateUserDTO).execute({ id });
  }

  async seed() {}
}
