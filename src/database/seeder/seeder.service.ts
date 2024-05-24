import { Inject, Injectable, Logger } from "@nestjs/common";

import { DRIZZLE_ASYNC_PROVIDER } from "@/database/drizzle.service";
import { categories } from "@/database/models";
import type { DatabaseType } from "@/database/types/db.type";

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

    return fs.readFile(
      join(__dirname, "./categories.json"),
      "utf8",
      function (err, data) {
        if (err) throw err;
        const res: string[] = JSON.parse(data);

        res.map(async (category) => {
          await db.insert(categories).values({
            label: category,
            status: "ACTIVE",
          });
        });
      },
    );
  }
}
