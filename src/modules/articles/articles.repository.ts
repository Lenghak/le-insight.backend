import { Inject, Injectable } from "@nestjs/common";

import type { GetArticlesListParamsType } from "@/modules/articles/dto/articles-list.dto";
import type { CreateArticlesDTO } from "@/modules/articles/dto/create-articles.dto";
import type { DeleteArticlesDTO } from "@/modules/articles/dto/delete-articles.dto";
import type { UpdateArticlesDTO } from "@/modules/articles/dto/update-articles.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as articleSchema from "@/database/models/articles";
import { RQPreviewArticlesColumns } from "@/database/schemas/articles/articles.schema";
import type { Articles } from "@/database/schemas/articles/articles.type";
import { RQMinimalProfileColumn } from "@/database/schemas/profiles/profiles.schema";
import { RQUsersColumns } from "@/database/schemas/users/users.schema";
import type { DatabaseType } from "@/database/types/db.type";

import { between, countDistinct, eq, ilike, or, sql } from "drizzle-orm";
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
        content_editor: createArticlesDTO.content_editor,
        visibility: createArticlesDTO.visibility,
        user_id: createArticlesDTO.user_id,
      })
      .returning();
  }

  async list(
    { limit, status, offset, q, from, to }: GetArticlesListParamsType,
    db: DatabaseType<typeof articleSchema> = this.db,
  ) {
    return await db.query.articles.findMany({
      columns: RQPreviewArticlesColumns,
      with: {
        article_author: {
          columns: RQUsersColumns,
          with: {
            profile: {
              columns: RQMinimalProfileColumn,
            },
          },
        },
        article_categories: true,
      },
      where: (articles, { and }) =>
        and(
          q ? ilike(articles.content_plain_text, `%${q}%`) : undefined,
          status ? eq(articles.visibility, status) : undefined,
          from && to
            ? or(
                between(articles.created_at, new Date(from), new Date(to)),
                between(articles.updated_at, new Date(from), new Date(to)),
              )
            : undefined,
        ),
      limit,
      offset,
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

  get({
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
      .update(articleSchema.articles)
      .set({
        visibility: "ARCHIVED",
      })
      .where(eq(articleSchema.articles.id, deleteArticleDTO.id))
      .returning();
  }
}
