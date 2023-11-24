import { Inject, Injectable } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/schemas/index.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findAll() {
    return await this.db.select().from(schema.usersTable);
  }

  async seed() {}
}
