import { Injectable } from "@nestjs/common";

import paginationHelper from "@/common/helpers/pagination.helper";

import { CategoriesRepository } from "@/modules/categories/categories.repository";
import type { CreateCategoryDto } from "@/modules/categories/dto/create-category.dto";
import type { GetCategoriesListDTO } from "@/modules/categories/dto/get-categories-list.dto";
import type { UpdateCategoryDto } from "@/modules/categories/dto/update-category.dto";

import type { CategoriesType } from "@/database/schemas/categories/categories.type";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async list({ limit = 50, page, ...params }: GetCategoriesListDTO) {
    const count = (await this.count(params.q))[0].value;
    const { hasNextPage, hasPreviousPage, offset, totalPages } =
      paginationHelper({ count, limit, page });

    const categories = await this.categoriesRepository.list({
      limit,
      offset,
      ...params,
    });

    return {
      data: categories,
      meta: {
        count,
        page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async count(q?: string) {
    return await this.categoriesRepository.count(q);
  }

  async get({
    by,
    values,
  }: {
    by: keyof CategoriesType;
    values: Record<string, unknown>;
  }) {
    return (await this.categoriesRepository.get({ by })).execute(values);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoriesRepository.create(createCategoryDto);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesRepository.update(id, updateCategoryDto);
  }
}
