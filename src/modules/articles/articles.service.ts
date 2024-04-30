import { Injectable } from "@nestjs/common";

import { ArticlesRepository } from "./articles.repository";
import type { CreateArticlesDTO } from "./dto/create-articles.dto";
import type { DeleteArticlesDTO } from "./dto/delete-articles.dto";
import type { UpdateArticlesDTO } from "./dto/update-articles.dto";

@Injectable()
export class ArticlesService {
  constructor(private readonly articleRepository: ArticlesRepository) {}

  async create(createArticleDTO: CreateArticlesDTO) {
    return await this.articleRepository.create(createArticleDTO);
  }

  async update(updateArticleDTO: UpdateArticlesDTO) {
    return await this.articleRepository.update(updateArticleDTO);
  }

  async delete(deleteArticleDTO: DeleteArticlesDTO) {
    return await this.articleRepository.delete(deleteArticleDTO);
  }
}
