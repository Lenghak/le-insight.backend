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
    { limit = 50, from, to, offset = 0, q, status }: GetCategoriesListParams,
    db: DatabaseType | DatabaseType<typeof categoriesSchema> = this.db,
  ) {
    const categories = categoriesSchema.categories;
    return await withPaginate({
      qb: db
        .select()
        .from(categories)
        .where(
          and(
            status ? eq(categories.status, status) : undefined,
            from && to
              ? or(
                  between(categories.created_at, new Date(from), new Date(to)),
                  between(categories.updated_at, new Date(from), new Date(to)),
                )
              : undefined,
            q ? ilike(categories.label, `%${q}%`) : undefined,
          ),
        )
        .$dynamic()
        .groupBy(categories.status),
      limit: limit,
      offset: offset,
      columns: [categories.id],
    });
  }

  async count(
    { q, status }: GetCategoriesListParams,
    db: DatabaseType<typeof categoriesSchema> = this.db,
  ) {
    const categories = categoriesSchema.categories;
    return await db
      .select({ value: countDistinct(categories.id) })
      .from(categories)
      .where(
        and(
          q ? ilike(categories.label, `%${q}%`) : undefined,
          status ? eq(categories.status, status) : undefined,
        ),
      );
  }

  async get({
    by,
    db = this.db,
  }: {
    by: keyof CategoriesType;
    db?: DatabaseType<typeof categoriesSchema>;
  }) {
    return db
      .selectDistinct()
      .from(categoriesSchema.categories)
      .where(eq(categoriesSchema.categories[by], sql.placeholder(by)))
      .prepare("get_category_by");
  }

  async all(
    columns?: Record<string, true>,
    db: DatabaseType<typeof categoriesSchema> = this.db,
  ) {
    return db?.query.categories.findMany({
      columns: {
        label: true,
        ...columns,
      },
      where: ({ status }) => eq(status, "ACTIVE"),
    });
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

  async delete(
    { id }: { id: string },
    db: DatabaseType<typeof categoriesSchema> = this.db,
  ) {
    return await db
      .delete(categoriesSchema.categories)
      .where(eq(categoriesSchema.categories.id, id));
  }
}
