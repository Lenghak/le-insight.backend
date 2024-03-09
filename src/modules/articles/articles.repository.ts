import { Inject, Injectable } from "@nestjs/common";

import type { CreateArticlesDTO } from "@/modules/articles/dto/create-articles.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as articlesSchema from "@/database/models/articles";
import type { DatabaseType } from "@/database/types/db.type";

import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ArticlesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof articlesSchema>,
  ) {}

  async create(
    createArticlesDTP: CreateArticlesDTO,
    db: DatabaseType | DatabaseType<typeof articlesSchema> = this.db,
  ) {
    return (db ?? this.db)
      .insert(articlesSchema.articles)
      .values({
        content: createArticlesDTP.content as string[],
        visibility: createArticlesDTP.visibility,
        user_id: createArticlesDTP.user_id,
      })
      .returning();
  }

  async list() {}

  async get() {}

  async update() {}

  async delete() {}
}
