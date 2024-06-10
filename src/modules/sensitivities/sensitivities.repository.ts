import { Inject, Injectable } from "@nestjs/common";

import type { CreateSensitivitiesDto } from "@/modules/sensitivities/dto/create-sensitivities.dto";
import type { GetSensitivitiesListParams } from "@/modules/sensitivities/dto/get-sensitivities-list.dto";
import type { UpdateSensitivitiesDto } from "@/modules/sensitivities/dto/update-sensitivities.dto";

import {
  DRIZZLE_ASYNC_PROVIDER,
  withPaginate,
} from "@/database/drizzle.service";
import * as sensitivitiesSchema from "@/database/models/sensitivities";
import type { SensitivitiesType } from "@/database/schemas/sensitivities/sensitivities.type";
import type { DatabaseType } from "@/database/types/db.type";

import { and, between, countDistinct, eq, ilike, or, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

@Injectable()
export class SensitivitiesRepository {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER)
    private readonly db: PostgresJsDatabase<typeof sensitivitiesSchema>,
  ) {}

  async list(
    { limit = 50, from, to, offset = 0, q, status }: GetSensitivitiesListParams,
    db: DatabaseType | DatabaseType<typeof sensitivitiesSchema> = this.db,
  ) {
    const sensitivities = sensitivitiesSchema.sensitivities;
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
    db: DatabaseType<typeof sensitivitiesSchema> = this.db,
  ) {
    const sensitivities = sensitivitiesSchema.sensitivities;
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

  async get({
    by,
    db = this.db,
  }: {
    by: keyof SensitivitiesType;
    db?: DatabaseType<typeof sensitivitiesSchema>;
  }) {
    return db
      .selectDistinct()
      .from(sensitivitiesSchema.sensitivities)
      .where(eq(sensitivitiesSchema.sensitivities[by], sql.placeholder(by)))
      .prepare("get_sensitivities_by");
  }

  async all(
    columns?: Record<string, true>,
    db: DatabaseType<typeof sensitivitiesSchema> = this.db,
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
    db: DatabaseType<typeof sensitivitiesSchema> = this.db,
  ) {
    return await db
      .insert(sensitivitiesSchema.sensitivities)
      .values({ ...createSensitivitiesDto })
      .returning();
  }

  async update(
    id: string,
    updateSensitivitiesDto: UpdateSensitivitiesDto,
    db: DatabaseType<typeof sensitivitiesSchema> = this.db,
  ) {
    return await db
      .update(sensitivitiesSchema.sensitivities)
      .set({ ...updateSensitivitiesDto })
      .where(eq(sensitivitiesSchema.sensitivities.id, id))
      .returning();
  }

  async delete(
    { id }: { id: string },
    db: DatabaseType<typeof sensitivitiesSchema> = this.db,
  ) {
    return await db
      .delete(sensitivitiesSchema.sensitivities)
      .where(eq(sensitivitiesSchema.sensitivities.id, id));
  }
}
