import { Inject, Injectable } from "@nestjs/common";

import type { CreateACDTO } from "@/modules/articles-categories/dto/create-ac.dto";
import type { DeleteACDTO } from "@/modules/articles-categories/dto/delete-ac.dto";
import type { GetACListDTO } from "@/modules/articles-categories/dto/get-ac-list.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as acSchema from "@/database/models/articles-categories";
import type { DatabaseType } from "@/database/types/db.type";

import { and, eq, or } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ArticlesCategoriesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof acSchema>,
  ) {}

  async list(
    getACListDTO: GetACListDTO,
    db: DatabaseType | DatabaseType<typeof acSchema> = this.db,
  ) {
    return db
      .select()
      .from(acSchema.articlesCategories)
      .where(
        or(
          getACListDTO.article_id
            ? eq(
                acSchema.articlesCategories.article_id,
                getACListDTO.article_id,
              )
            : undefined,
          getACListDTO.category_id
            ? eq(
                acSchema.articlesCategories.category_id,
                getACListDTO.category_id,
              )
            : undefined,
        ),
      );
  }

  async create(
    createACDTO: CreateACDTO,
    db: DatabaseType | DatabaseType<typeof acSchema> = this.db,
  ) {
    return db
      .insert(acSchema.articlesCategories)
      .values({
        article_id: createACDTO.article_id,
        category_id: createACDTO.category_id,
      })
      .returning();
  }

  async delete(
    deleteACDTO: DeleteACDTO,
    db: DatabaseType | DatabaseType<typeof acSchema> = this.db,
  ) {
    return db
      .delete(acSchema.articlesCategories)
      .where(
        and(
          eq(acSchema.articlesCategories.article_id, deleteACDTO.article_id),
          deleteACDTO.category_id
            ? eq(
                acSchema.articlesCategories.category_id,
                deleteACDTO.category_id,
              )
            : undefined,
        ),
      )
      .returning();
  }
}
