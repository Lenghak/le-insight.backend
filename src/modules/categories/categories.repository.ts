import { Inject, Injectable } from "@nestjs/common";

import type { CreateCategoryDto } from "@/modules/categories/dto/create-category.dto";
import type { GetCategoriesListParams } from "@/modules/categories/dto/get-categories-list.dto";
import type { UpdateCategoryDto } from "@/modules/categories/dto/update-category.dto";

import {
  DRIZZLE_ASYNC_PROVIDER,
  withPaginate,
} from "@/database/drizzle.service";
import * as categoriesSchema from "@/database/models/categories";
import type { CategoriesType } from "@/database/schemas/categories/categories.type";
import type { DatabaseType } from "@/database/types/db.type";

import { and, between, countDistinct, eq, ilike, or, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class CategoriesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof categoriesSchema>,
  ) {}

  async list(
    { limit, from, to, offset, q }: GetCategoriesListParams,
    db: DatabaseType | DatabaseType<typeof categoriesSchema> = this.db,
  ) {
    const categories = categoriesSchema.categories;
    return await withPaginate({
      qb: db
        .select({
          id: categories.id,
          created_at: categories.created_at,
          updated_at: categories.updated_at,
        })
        .from(categories)
        .where(
          from && to
            ? or(
                between(categories.created_at, new Date(from), new Date(to)),
                between(categories.updated_at, new Date(from), new Date(to)),
              )
            : undefined,
        )
        .$dynamic(),
      limit: limit,
      offset: offset,
      columns: [categories.id],
    }).where(and(q ? ilike(categories.label, `%${q}%`) : undefined));
  }

  async count(
    query?: string,
    db: DatabaseType<typeof categoriesSchema> = this.db,
  ) {
    const categories = categoriesSchema.categories;
    return await db
      .select({ value: countDistinct(categories.id) })
      .from(categories)
      .where(query ? ilike(categories.label, `%${query}%`) : undefined);
  }

  async get({
    by,
    db = this.db,
  }: {
    by: keyof CategoriesType;
    db?: DatabaseType<typeof categoriesSchema>;
  }) {
    return db.query.categories
      .findFirst({
        where: (categoriesSchema, { eq }) =>
          eq(categoriesSchema[by], sql.placeholder[by]),
      })
      .prepare("get_categories_list");
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    db: DatabaseType<typeof categoriesSchema> = this.db,
  ) {
    return await db
      .insert(categoriesSchema.categories)
      .values({ ...createCategoryDto })
      .returning();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    db: DatabaseType<typeof categoriesSchema> = this.db,
  ) {
    return await db
      .update(categoriesSchema.categories)
      .set({ ...updateCategoryDto })
      .where(eq(categoriesSchema.categories.id, id))
      .returning();
  }
}
