import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as profileSchema from "@/database/models/profiles.model";
import { type DatabaseType } from "@/database/types/db.types";

import { eq, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { type Profiles } from "./types/profiles.type";

@Injectable()
export class ProfilesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof profileSchema>,
  ) {}

  create(db?: DatabaseType) {
    return (db ?? this.db)
      .insert(profileSchema.profiles)
      .values({
        first_name: sql.placeholder("firstName"),
        last_name: sql.placeholder("lastName"),
      })
      .returning()
      .prepare("insert_profile");
  }

  getAll(db?: DatabaseType) {
    return (
      (db as unknown as DatabaseType<typeof profileSchema>) ?? this.db
    ).query.profiles
      .findMany({
        limit: 50,
      })
      .prepare("get_all_profiles");
  }

  get({ by }: { by: keyof Profiles }) {
    return this.db.query.profiles
      .findFirst({ where: eq(profileSchema.profiles, by) })
      .prepare("get_a_profile");
  }
}
