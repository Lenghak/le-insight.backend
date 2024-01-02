import { Inject, Injectable } from "@nestjs/common";

import { type CreateProfileDTO } from "@/modules/profiles/dto/create-profile.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models/profiles.schema";

import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { type Profiles } from "./types/profiles.type";

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

  getAll() {
    return this.db.query.profiles
      .findMany({
        limit: 50,
      })
      .prepare("get_all_profiles");
  }

  get({ by }: { by: keyof Profiles }) {
    return this.db.query.profiles
      .findFirst({ where: eq(schema.profiles, by) })
      .prepare("get_a_profile");
  }
}
