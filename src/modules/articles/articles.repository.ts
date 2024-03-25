import { Inject, Injectable } from "@nestjs/common";

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

import { eq, ilike, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class ArticlesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof articleSchema>,
  ) {}

  async create(
    createArticlesDTP: CreateArticlesDTO,
    db: DatabaseType | DatabaseType<typeof articleSchema> = this.db,
  ) {
    return db
      .insert(articleSchema.articles)
      .values({
        content: createArticlesDTP.content,
        visibility: createArticlesDTP.visibility,
        user_id: createArticlesDTP.user_id,
      })
      .returning();
  }

  async list(
    limit: number,
    offset: number,
    query?: string,
    db: DatabaseType | DatabaseType<typeof articleSchema> = this.db,
  ) {
    return await withPaginate(
      db
        .select()
        .from(articleSchema.articles)
        .leftJoin(
          userSchema.users,
          eq(articleSchema.articles.user_id, userSchema.users.id),
        )
        .$dynamic(),
      limit,
      offset,
      articleSchema.articles.id,
      userSchema.users.id,
    ).where(
      query ? ilike(articleSchema.articles.content, `%${query}%`) : undefined,
    );
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
        content: updateArticleDTO.content,
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
