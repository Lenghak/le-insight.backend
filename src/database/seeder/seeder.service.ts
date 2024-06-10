import { Inject, Injectable, Logger } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import { categories, sensitivities } from "@/database/models";
import type { DatabaseType } from "@/database/types/db.type";

import { eq } from "drizzle-orm";

import fs from "fs";
import { join } from "path";

@Injectable()
export class SeederService {
  constructor(
    @Inject(DRIZZLE_ASYNC_PROVIDER) private readonly db: DatabaseType,
  ) {}

  async seed() {
    Logger.debug("Starting seed");
    const db = this.db;

    // fs.readFile(
    //   join(__dirname, "./categories.json"),
    //   "utf8",
    //   function (err, data) {
    //     if (err) throw err;
    //     const res: string[] = JSON.parse(data);

    //     new Set(res).forEach((category) => {
    //       db.select()
    //         .from(categories)
    //         .where(eq(categories.label, category))
    //         .then(async (existingCategory) => {
    //           Logger.debug({
    //             subject: category,
    //             is_already_exist: !!existingCategory[0]?.id,
    //           });

    //           if (!existingCategory[0]?.id)
    //             await db.insert(categories).values({
    //               label: category,
    //               status: "ACTIVE",
    //             });
    //         });
    //     });
    //   },
    // );

    fs.readFile(
      join(__dirname, "./sensitivities.json"),
      "utf8",
      function (err, data) {
        if (err) throw err;
        const res: string[] = JSON.parse(data);

        new Set(res).forEach((sens) => {
          db.select()
            .from(sensitivities)
            .where(eq(sensitivities.label, sens))
            .then(async (existingSensitivity) => {
              if (!existingSensitivity[0]?.id)
                await db.insert(categories).values({
                  label: sens,
                  status: "ACTIVE",
                });
            });
        });
      },
    );
  }
}
