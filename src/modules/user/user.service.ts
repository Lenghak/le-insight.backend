import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models";

import { compare, genSalt, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { type CreateUserDTO } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly config: ConfigService,
  ) {}

  /**
   * The `findAll` function retrieves all records from the `users` in the database.
   * @returns The `findAll()` function is returning the result of the database query, which is a list
   * of all the records from the `users` in the `schema`.
   */
  async findAll() {
    // TODO: include pagination
    return await this.db.select().from(schema.users).limit(50);
  }

  /**
   * The function creates a new user by checking if the email already exists, encrypting the password,
   * and inserting the user data into the database.
   * @param {CreateUserDTO} createUserDTO - The `createUserDTO` parameter is an object that contains
   * the data needed to create a new user. It typically includes properties such as `email` and
   * `password`, which are used to create a new user in the database.
   * @returns the result of the database insert operation.
   */
  async create(createUserDTO: CreateUserDTO) {
    const isExist = await this.findByEmail(createUserDTO.email);

    if (isExist.length) {
      throw new ConflictException();
    }

    const salt = await genSalt(12);
    const pepper = this.config.getOrThrow("PEPPER_SECRET");

    const encryptedPassword = await hash(createUserDTO.password, salt + pepper);

    return await this.db
      .insert(schema.users)
      .values({
        email: createUserDTO.email,
        encrypted_password: encryptedPassword,
        salt: salt,
      })
      .returning();
  }

  /**
   * The function retrieves a user's ID from the database based on their email and throws an exception
   * if the user is not found.
   * @param {string} email - The `email` parameter is a string that represents the email address of the
   * user you want to retrieve from the database.
   * @returns the user ID if a user with the specified email is found in the database.
   */
  async findByEmail(email: string) {
    return await this.db
      .selectDistinct()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
  }

  async validateUser(email: string, password: string) {
    // find user by email
    const user = await this.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const isCorrectPassword = await compare(password, user[0].email);

    if (!isCorrectPassword) throw new UnauthorizedException();

    return user;
  }

  async seed() {}
}
