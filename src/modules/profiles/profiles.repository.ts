import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models/profiles.schema";

import { eq, type ExtractTablesWithRelations, sql } from "drizzle-orm";
import { type PgTransaction } from "drizzle-orm/pg-core";
import {
  PostgresJsDatabase,
  type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";

import { type Profiles } from "./types/profiles.type";

@Injectable()
export class ProfilesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  create(
    db?:
      | PostgresJsDatabase
      | PgTransaction<
          PostgresJsQueryResultHKT,
          Record<string, never>,
          ExtractTablesWithRelations<Record<string, never>>
        >,
  ) {
    return (db ?? this.db)
      .insert(schema.profiles)
      .values({
        first_name: sql.placeholder("firstName"),
        last_name: sql.placeholder("lastName"),
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
