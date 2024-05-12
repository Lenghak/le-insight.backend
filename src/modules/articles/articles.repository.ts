import { Inject, Injectable } from "@nestjs/common";

import type { GetArticlesListParamsType } from "@/modules/articles/dto/articles-list.dto";
import type { CreateArticlesDTO } from "@/modules/articles/dto/create-articles.dto";
import type { DeleteArticlesDTO } from "@/modules/articles/dto/delete-articles.dto";
import type { UpdateArticlesDTO } from "@/modules/articles/dto/update-articles.dto";

import {
  DRIZZLE_ASYNC_PROVIDER,
  withPaginate,
} from "@/database/drizzle.service";
import * as articleSchema from "@/database/models/articles";
import * as userSchema from "@/database/models/users";
import type { Articles } from "@/database/schemas/articles/articles.type";
import type { DatabaseType } from "@/database/types/db.type";

import { and, between, countDistinct, eq, ilike, or, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ArticlesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof articleSchema>,
  ) {}

  async create(
    createArticlesDTO: CreateArticlesDTO,
    db: DatabaseType | DatabaseType<typeof articleSchema> = this.db,
  ) {
    return db
      .insert(articleSchema.articles)
      .values({
        preview_title: createArticlesDTO.preview_title,
        preview_description: createArticlesDTO.preview_description,
        content_html: createArticlesDTO.content_html,
        content_plain_text: createArticlesDTO.content_plain_text,
        visibility: createArticlesDTO.visibility,
        user_id: createArticlesDTO.user_id,
      })
      .returning();
  }

  async list(
    { limit, status, offset, q, from, to }: GetArticlesListParamsType,
    db: DatabaseType | DatabaseType<typeof articleSchema> = this.db,
  ) {
    return await withPaginate({
      qb: db
        .select()
        .from(articleSchema.articles)
        .where(
          and(
            q
              ? ilike(articleSchema.articles.content_plain_text, `%${q}%`)
              : undefined,
            status ? eq(articleSchema.articles.visibility, status) : undefined,
            from && to
              ? or(
                  between(
                    articleSchema.articles.created_at,
                    new Date(from),
                    new Date(to),
                  ),
                  between(
                    articleSchema.articles.updated_at,
                    new Date(from),
                    new Date(to),
                  ),
                )
              : undefined,
          ),
        )
        .leftJoin(
          userSchema.users,
          eq(articleSchema.articles.user_id, userSchema.users.id),
        )
        .$dynamic(),
      limit,
      offset,
      columns: [articleSchema.articles.id, userSchema.users.id],
    });
  }

  async count(
    query?: string,
    db: DatabaseType<typeof articleSchema> = this.db,
  ) {
    const articles = articleSchema.articles;
    return await db
      .select({ value: countDistinct(articles.id) })
      .from(articles)
      .where(query ? ilike(articles.preview_title, `%${query}%`) : undefined);
  }

  async get({
    by,
    db = this.db,
  }: {
    by: keyof Articles;
    db?: DatabaseType<typeof articleSchema>;
  }) {
    return db.query.articles
      .findFirst({
        with: {
          article_author: true,
          article_categories: true,
        },
        where: (articles, { eq }) => eq(articles[by], sql.placeholder(by)),
      })
      .prepare("get_articles_by_key");
  }

  async update(
    updateArticleDTO: UpdateArticlesDTO,
    db: DatabaseType | DatabaseType<typeof articleSchema> = this.db,
  ) {
    return db
      .update(articleSchema.articles)
      .set({
        ...updateArticleDTO,
        content_html: updateArticleDTO.content_html,
        content_plain_text: updateArticleDTO.content_plain_text,
      })
      .where(eq(articleSchema.articles.id, updateArticleDTO.id ?? ""))
      .returning();
  }

  async delete(
    deleteArticleDTO: DeleteArticlesDTO,
    db: DatabaseType | DatabaseType<typeof articleSchema> = this.db,
  ) {
    return db
      .delete(articleSchema.articles)
      .where(eq(articleSchema.articles.id, deleteArticleDTO.id))
      .returning();
  }
}
