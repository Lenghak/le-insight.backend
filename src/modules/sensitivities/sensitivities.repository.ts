import { Inject, Injectable } from "@nestjs/common";

import type { CreateASDTO } from "@/modules/sensitivities/dto/create-as.dto";
import type { CreateSensitivitiesDto } from "@/modules/sensitivities/dto/create-sensitivities.dto";
import type { DeleteASDTO } from "@/modules/sensitivities/dto/delete-as.dto";
import type { GetSensitivitiesListParams } from "@/modules/sensitivities/dto/get-sensitivities-list.dto";
import type { UpdateSensitivitiesDto } from "@/modules/sensitivities/dto/update-sensitivities.dto";

import {
  DRIZZLE_ASYNC_PROVIDER,
  withPaginate,
} from "@/database/drizzle.service";
import * as schema from "@/database/models";
import type { SensitivitiesType } from "@/database/schemas/sensitivities/sensitivities.type";
import type { DatabaseType } from "@/database/types/db.type";

import { and, between, countDistinct, eq, ilike, or, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class SensitivitiesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async list(
    { limit = 50, from, to, offset = 0, q, status }: GetSensitivitiesListParams,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    const sensitivities = schema.sensitivities;
    return await withPaginate({
      qb: db
        .select()
        .from(sensitivities)
        .where(
          and(
            status ? eq(sensitivities.status, status) : undefined,
            from && to
              ? or(
                  between(
                    sensitivities.created_at,
                    new Date(from),
                    new Date(to),
                  ),
                  between(
                    sensitivities.updated_at,
                    new Date(from),
                    new Date(to),
                  ),
                )
              : undefined,
            q ? ilike(sensitivities.label, `%${q}%`) : undefined,
          ),
        )
        .$dynamic()
        .groupBy(sensitivities.status),
      limit: limit,
      offset: offset,
      columns: [sensitivities.id],
    });
  }

  async count(
    { q, status }: GetSensitivitiesListParams,
    db: DatabaseType<typeof schema> = this.db,
  ) {
    const sensitivities = schema.sensitivities;
    return await db
      .select({ value: countDistinct(sensitivities.id) })
      .from(sensitivities)
      .where(
        and(
          q ? ilike(sensitivities.label, `%${q}%`) : undefined,
          status ? eq(sensitivities.status, status) : undefined,
        ),
      );
  }

  get({
    by,
    db = this.db,
  }: {
    by: keyof SensitivitiesType;
    db?: DatabaseType<typeof schema>;
  }) {
    return db
      .selectDistinct()
      .from(schema.sensitivities)
      .where(eq(schema.sensitivities[by], sql.placeholder(by)))
      .prepare("get_sensitivities_by");
  }

  async all(
    columns?: Record<string, true>,
    db: DatabaseType<typeof schema> = this.db,
  ) {
    return db?.query.sensitivities.findMany({
      columns: {
        label: true,
        ...columns,
      },
      where: ({ status }) => eq(status, "ACTIVE"),
    });
  }

  async create(
    createSensitivitiesDto: CreateSensitivitiesDto,
    db: DatabaseType<typeof schema> = this.db,
  ) {
    return await db
      .insert(schema.sensitivities)
      .values({ ...createSensitivitiesDto })
      .returning();
  }

  async update(
    id: string,
    updateSensitivitiesDto: UpdateSensitivitiesDto,
    db: DatabaseType<typeof schema> = this.db,
  ) {
    return await db
      .update(schema.sensitivities)
      .set({ ...updateSensitivitiesDto })
      .where(eq(schema.sensitivities.id, id))
      .returning();
  }

  async delete(
    { id }: { id: string },
    db: DatabaseType<typeof schema> = this.db,
  ) {
    return await db
      .delete(schema.sensitivities)
      .where(eq(schema.sensitivities.id, id));
  }

  async bridge(
    createASDTO: CreateASDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .insert(schema.articlesSensitivities)
      .values({
        article_id: createASDTO.article_id,
        sensitivity_id: createASDTO.sensitivity_id,
        sentiment: createASDTO.sentiment,
      })
      .returning();
  }

  async break(
    deleteACDTO: DeleteASDTO,
    db: DatabaseType | DatabaseType<typeof schema> = this.db,
  ) {
    return db
      .delete(schema.articlesSensitivities)
      .where(
        and(
          eq(schema.articlesSensitivities.article_id, deleteACDTO.article_id),
          deleteACDTO.sensitivity_id
            ? eq(
                schema.articlesSensitivities.sensitivity_id,
                deleteACDTO.sensitivity_id,
              )
            : undefined,
        ),
      )
      .returning();
  }
}
