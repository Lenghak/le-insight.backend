import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { type CreateUserDTO } from "./dto/create-user.dto";
import { UsersRepository } from "./repo/users.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * The `findAll` function retrieves all records from the `users` in the database.
   * @returns The `findAll()` function is returning the result of the database query, which is a list
   * of all the records from the `users` in the `schema`.
   */
  async findAll() {
    // TODO: include pagination
    return await this.usersRepository.getAll().execute();
  }

  /**
   * The function creates a new user by checking if the email already exists, encrypting the password,
   * and inserting the user data into the database.
   * @param {CreateUserDTO} createUserDTO - The `createUserDTO` parameter is an object that contains
   * the data needed to create a new user. It typically includes properties such as `email` and
   * `password`, which are used to create a new user in the database.
   * @returns the result of the database insert operation.
   */
  async create(_: CreateUserDTO) {
    // const isExist = await this.findByEmail(createUserDTO.email);
    // if (isExist.length) {
    //   throw new ConflictException();
    // }
    // const salt = await genSalt(12);
    // const pepper = this.config.getOrThrow("PEPPER_SECRET");
    // const encryptedPassword = await hash(createUserDTO.password, salt + pepper);
    // return await this.db
    //   .insert(schema.users)
    //   .values({
    //     email: createUserDTO.email,
    //     encrypted_password: encryptedPassword,
    //     salt: salt,
    //   })
    //   .returning();
  }

  /**
   * The function retrieves a user's ID from the database based on their email and throws an exception
   * if the user is not found.
   * @param {string} email - The `email` parameter is a string that represents the email address of the
   * user you want to retrieve from the database.
   * @returns the user ID if a user with the specified email is found in the database.
   */
  async findByEmail(_: string) {
    // return await this.db
    //   .selectDistinct()
    //   .from(schema.users)
    //   .where(eq(schema.users.email, email))
    //   .limit(1);
  }

  async update() {}

  /**
   * The function validates a user by checking if the provided email and password match a user in the
   * database.
   * @param {string} email - A string representing the email of the user to be validated.
   * @param {string} password - The `password` parameter is a string that represents the password
   * entered by the user.
   * @returns The user object is being returned.
   */
  async validateUser(_: string, __: string) {
    // const user = await this.findByEmail(email);
    // if (!user) throw new UnauthorizedException();
    // const isCorrectPassword = await compare(password, user[0].email);
    // if (!isCorrectPassword) throw new UnauthorizedException();
    // return user;
  }

  async seed() {}
}
