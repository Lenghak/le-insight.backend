import { Injectable } from "@nestjs/common";

import { ArticlesCategoriesRepository } from "@/modules/articles-categories/articles-categories.repository";
import type { CreateACDTO } from "@/modules/articles-categories/dto/create-ac.dto";

import * as acSchema from "@/database/models/articles-categories";
import type { DatabaseType } from "@/database/types/db.type";

@Injectable()
export class ArticlesCategoriesService {
  constructor(private readonly acRepository: ArticlesCategoriesRepository) {}

  async create(
    createACDTO: CreateACDTO,
    db?: DatabaseType | DatabaseType<typeof acSchema>,
  ) {
    return await this.acRepository.create(createACDTO, db);
  }
}
