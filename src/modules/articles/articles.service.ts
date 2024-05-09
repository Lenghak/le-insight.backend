import { Injectable } from "@nestjs/common";

import { ArticlesRepository } from "./articles.repository";
import type { CreateArticlesDTO } from "./dto/create-articles.dto";
import type { DeleteArticlesDTO } from "./dto/delete-articles.dto";
import type { UpdateArticlesDTO } from "./dto/update-articles.dto";

@Injectable()
export class ArticlesService {
  constructor(private readonly articleRepository: ArticlesRepository) {}

  // async list({ limit = 50, page, status, ...params }) {
  //   const count = (await this.count(params.q))[0].value;
  //   const { hasNextPage, hasPreviousPage, offset, totalPages } =
  //     paginationHelper({ count, limit, page });

  //   const categories = await this.categoriesRepository.list({
  //     limit,
  //     offset,
  //     status,
  //     ...params,
  //   });

  //   return {
  //     data: categories,
  //     meta: {
  //       count,
  //       page,
  //       totalPages,
  //       hasNextPage,
  //       hasPreviousPage,
  //     },
  //   };
  // }

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
