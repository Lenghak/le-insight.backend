import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";

import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { ProfilesService } from "../profiles/profiles.service";
import { UsersService } from "../users/users.service";
import { type SignUpDTO } from "./dto/sign-up.dto";

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER) private readonly db: PostgresJsDatabase,
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
  ) {}

  async createUserTransaction(signUpDTO: SignUpDTO) {
    return await this.db.transaction(async (tx) => {
      (
        await this.profilesService.create({
          createProfilesDTO: {
            firstName: signUpDTO.firstName,
            lastName: signUpDTO.lastName,
          },
          db: tx,
        })
      )[0];
    });
  }
}
