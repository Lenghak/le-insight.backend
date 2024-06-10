import { Inject, Injectable } from "@nestjs/common";

import type { CreateACDTO } from "@/modules/articles-categories/dto/create-ac.dto";
import type { DeleteACDTO } from "@/modules/articles-categories/dto/delete-ac.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models";
import type { DatabaseType } from "@/database/types/db.type";

import { and, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ArticlesCategoriesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(
    createACDTO: CreateACDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .insert(schema.articlesCategories)
      .values({
        article_id: createACDTO.article_id,
        category_id: createACDTO.category_id,
      })
      .returning();
  }

  async delete(
    deleteACDTO: DeleteACDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .delete(schema.articlesCategories)
      .where(
        and(
          eq(schema.articlesCategories.article_id, deleteACDTO.article_id),
          deleteACDTO.category_id
            ? eq(schema.articlesCategories.category_id, deleteACDTO.category_id)
            : undefined,
        ),
      )
      .returning();
  }
}
