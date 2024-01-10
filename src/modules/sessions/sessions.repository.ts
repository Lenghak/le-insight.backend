import { Inject } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as sessionSchemas from "@/database/models/auth/sessions.schema";

import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { type CreateSessionsDTO } from "./dto/create-sessions.dto";

export class SessionsRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof sessionSchemas>,
  ) {}

  create(createSessionsDTO: CreateSessionsDTO) {
    return this.db.insert(sessionSchemas.sessions).values(createSessionsDTO);
  }
}
