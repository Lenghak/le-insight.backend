import { Inject, Injectable } from "@nestjs/common";

import type { CreateACDTO } from "@/modules/articles-categories/dto/create-ac.dto";
import type { DeleteACDTO } from "@/modules/articles-categories/dto/delete-ac.dto";
import type { GetACAllDTO } from "@/modules/articles-categories/dto/get-ac-all.dto";
import type { GetArticlesListParamsType } from "@/modules/articles/dto/articles-list.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models";
import { RQPreviewArticlesColumns } from "@/database/schemas/articles/articles.schema";
import { RQMinimalProfileColumns } from "@/database/schemas/profiles/profiles.schema";
import { RQUsersColumns } from "@/database/schemas/users/users.schema";
import type { DatabaseType } from "@/database/types/db.type";

import { and, between, countDistinct, eq, ilike, or } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ArticlesCategoriesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async all(
    getACListDTO: GetACAllDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .select()
      .from(schema.articlesCategories)
      .where(
        or(
          getACListDTO.article_id
            ? eq(schema.articlesCategories.article_id, getACListDTO.article_id)
            : undefined,
          getACListDTO.category_id
            ? eq(
                schema.articlesCategories.category_id,
                getACListDTO.category_id,
              )
            : undefined,
        ),
      );
  }

  async list(
    params: GetArticlesListParamsType,
    db: DatabaseType<typeof schema> = this.db,
  ) {
    return db.query.articlesCategories.findMany({
      with: {
        article: {
          columns: RQPreviewArticlesColumns,
          with: {
            article_author: {
              columns: RQUsersColumns,
              with: {
                profile: { columns: RQMinimalProfileColumns },
              },
            },
            article_categories: {
              with: {
                category: true,
              },
            },
          },
        },
      },
      where: and(
        params.categoryId
          ? eq(schema.articlesCategories.category_id, params.categoryId)
          : undefined,
        params.q
          ? ilike(schema.articles.preview_title, `%${params.q}%`)
          : undefined,
        params.status
          ? eq(schema.articles.visibility, params.status)
          : undefined,
        params.from && params.to
          ? or(
              between(
                schema.articles.created_at,
                new Date(params.from),
                new Date(params.to),
              ),
              between(
                schema.articles.updated_at,
                new Date(params.from),
                new Date(params.to),
              ),
            )
          : undefined,
      ),
    });
  }

  async count({ ...params }: GetArticlesListParamsType) {
    const ac = schema.articlesCategories;
    return await this.db
      .select({ value: countDistinct(ac.article_id) })
      .from(schema.articlesCategories)
      .where(
        and(
          params.categoryId
            ? eq(schema.articlesCategories.category_id, params.categoryId)
            : undefined,
          params.q
            ? ilike(schema.articles.preview_title, `%${params.q}%`)
            : undefined,
          params.status
            ? eq(schema.articles.visibility, params.status)
            : undefined,
          params.from && params.to
            ? or(
                between(
                  schema.articles.created_at,
                  new Date(params.from),
                  new Date(params.to),
                ),
                between(
                  schema.articles.updated_at,
                  new Date(params.from),
                  new Date(params.to),
                ),
              )
            : undefined,
        ),
      );
  }

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
