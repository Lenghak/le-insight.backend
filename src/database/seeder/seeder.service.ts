import { Inject, Injectable, Logger } from "@nestjs/common";

import { CategoriesRepository } from "@/modules/categories/categories.repository";
import { CategoriesService } from "@/modules/categories/categories.service";

import fs from "fs";
import { join } from "path";

@Injectable()
export class SeederService {
  constructor(
    @Inject(CategoriesService)
    private readonly categoriesService: CategoriesService,
    @Inject(CategoriesRepository)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async seed() {
    Logger.debug("Starting seed");

    const categoriesService = this.categoriesService;
    console.log(categoriesService);

    fs.readFile(
      join(__dirname, "./categories.json"),
      "utf8",
      function (err, data) {
        if (err) throw err;
        const res: { category: string; description: string }[] =
          JSON.parse(data);
        res.forEach((o) => {
          categoriesService.create({
            is_archived: false,
            label: o.category,
            status: "ACTIVE",
          });
        });
      },
    );
  }
}
