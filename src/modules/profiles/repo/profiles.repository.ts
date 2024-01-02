import { Inject, Injectable } from "@nestjs/common";

import { type CreateProfileDTO } from "@/modules/profiles/dto/create-profile.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models/profiles.schema";

import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ProfilesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  create(createProfileDTO: CreateProfileDTO) {
    return this.db
      .insert(schema.profiles)
      .values({
        first_name: createProfileDTO.firstName,
        last_name: createProfileDTO.lastName,
      })
      .returning()
      .prepare("insert_profile");
  }
}
