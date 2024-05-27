import { Inject, Injectable } from "@nestjs/common";

import type { GetArticlesListParamsType } from "@/modules/articles/dto/articles-list.dto";
import type { CreateArticlesDTO } from "@/modules/articles/dto/create-articles.dto";
import type { DeleteArticlesDTO } from "@/modules/articles/dto/delete-articles.dto";
import type { UpdateArticlesDTO } from "@/modules/articles/dto/update-articles.dto";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import * as schema from "@/database/models";
import { RQPreviewArticlesSelectColumns } from "@/database/schemas/articles/articles.schema";
import type { Articles } from "@/database/schemas/articles/articles.type";
import { RQMinimalProfileSelectColumns } from "@/database/schemas/profiles/profiles.schema";
import { RQUsersSelectColumns } from "@/database/schemas/users/users.schema";
import type { DatabaseType } from "@/database/types/db.type";

import { and, between, countDistinct, eq, ilike, or, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ArticlesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(
    createArticlesDTO: CreateArticlesDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .insert(schema.articles)
      .values({
        ...createArticlesDTO,
      })
      .returning();
  }

  async list(
    params: GetArticlesListParamsType,
    db: DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .select({
        ...RQPreviewArticlesSelectColumns,
        article_author: {
          ...RQUsersSelectColumns,
          //@ts-expect-error another nested type is not assignable to PgColumn ...
          profile: { ...RQMinimalProfileSelectColumns },
        },
        article_categories: sql<
          Array<{ article_id: string; category_id: string }>
        >`
        (
          SELECT json_agg(articles_categories) 
          FROM articles_categories
          WHERE articles_categories.article_id = articles.id
        )
        `.as("article_categories"),
      })
      .from(schema.articles)
      .where(
        and(
          params.categoryId
            ? eq(schema.articlesCategories.category_id, params.categoryId)
            : undefined,
          params.q
            ? ilike(schema.articles.content_plain_text, `%${params.q}%`)
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
      )
      .innerJoin(schema.users, eq(schema.articles.user_id, schema.users.id))
      .innerJoin(
        schema.profiles,
        eq(schema.profiles.id, schema.users.profile_id),
      )
      .groupBy(schema.articles.id, schema.users.id, schema.profiles.id)
      .$dynamic()
      .limit(params.limit > 200 || params.limit <= 0 ? 50 : params.limit)
      .offset(params.offset);

    // return await db.query.articles.findMany({
    //   columns: RQPreviewArticlesColumns,
    //   with: {
    //     article_author: {
    //       columns: RQUsersColumns,
    //       with: {
    //         profile: {
    //           columns: RQMinimalProfileColumn,
    //         },
    //       },
    //     },
    //     article_categories: {
    //       where: (articlesCategories, { and, eq }) =>
    //         and(
    //           params?.categoryId
    //             ? eq(articlesCategories.category_id, params.categoryId)
    //             : undefined,
    //         ),
    //     },
    //   },
    //   where: and(
    //     params.q
    //       ? ilike(schema.articles.content_plain_text, `%${params.q}%`)
    //       : undefined,
    //     params.status
    //       ? eq(schema.articles.visibility, params.status)
    //       : undefined,
    //     params.from && params.to
    //       ? or(
    //           between(
    //             schema.articles.created_at,
    //             new Date(params.from),
    //             new Date(params.to),
    //           ),
    //           between(
    //             schema.articles.updated_at,
    //             new Date(params.from),
    //             new Date(params.to),
    //           ),
    //         )
    //       : undefined,
    //   ),
    //   limit: params.limit,
    //   offset: params.offset,
    // });
  }

  async count(query?: string, db: DatabaseType<typeof schema> = this.db) {
    const articles = schema.articles;
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
    db?: DatabaseType<typeof schema>;
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
    id: string,
    updateArticleDTO: UpdateArticlesDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .update(schema.articles)
      .set({
        ...updateArticleDTO,
        content_html: updateArticleDTO.content_html,
        content_plain_text: updateArticleDTO.content_plain_text,
      })
      .where(eq(schema.articles.id, id ?? ""))
      .returning();
  }

  async delete(
    deleteArticleDTO: DeleteArticlesDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .update(schema.articles)
      .set({
        visibility: "ARCHIVED",
      })
      .where(eq(schema.articles.id, deleteArticleDTO.id))
      .returning();
  }
}
