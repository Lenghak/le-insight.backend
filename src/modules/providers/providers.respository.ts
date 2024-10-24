import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as providerSchema from "@/database/models/providers/providers.model";
import type { DatabaseType } from "@/database/types/db.type";

import { sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ProvidersRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof providerSchema>,
  ) {}
  create(db?: DatabaseType) {
    return (db ?? this.db)
      .insert(providerSchema.providers)
      .values({
        provider: sql.placeholder("provider"),
        user_id: sql.placeholder("user_id"),
      })
      .prepare("insert_create_provider");
  }

  getAll(db?: DatabaseType) {
    return (db ?? this.db)
      .select()
      .from(providerSchema.providers)
      .prepare("get_providers");
  }
}
