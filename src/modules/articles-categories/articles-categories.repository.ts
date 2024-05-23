import { Inject, Injectable } from "@nestjs/common";

import type { CreateACDTO } from "@/modules/articles-categories/dto/create-ac.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as acSchema from "@/database/models/articles-categories";
import type { DatabaseType } from "@/database/types/db.type";

import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ArticlesCategoriesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof acSchema>,
  ) {}

  async create(
    createACDTO: CreateACDTO,
    db: DatabaseType | DatabaseType<typeof acSchema> = this.db,
  ) {
    return db.insert(acSchema.articlesCategories).values({
      article_id: createACDTO.article_id,
      category_id: createACDTO.category_id,
    });
  }
}
