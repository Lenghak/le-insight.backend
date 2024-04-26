import { ConflictException, Injectable } from "@nestjs/common";

import paginationHelper from "@/common/helpers/pagination.helper";

import { CategoriesRepository } from "@/modules/categories/categories.repository";
import type { CreateCategoryDto } from "@/modules/categories/dto/create-category.dto";
import type { GetCategoriesListDTO } from "@/modules/categories/dto/get-categories-list.dto";
import type { UpdateCategoryDto } from "@/modules/categories/dto/update-category.dto";

import type { CategoriesType } from "@/database/schemas/categories/categories.type";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async list({ limit = 50, page, status, ...params }: GetCategoriesListDTO) {
    const count = (await this.count(params.q))[0].value;
    const { hasNextPage, hasPreviousPage, offset, totalPages } =
      paginationHelper({ count, limit, page });

    const categories = await this.categoriesRepository.list({
      limit,
      offset,
      status,
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
    return (
      await (await this.categoriesRepository.get({ by })).execute(values)
    ).at(0);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.get({
      by: "label",
      values: {
        label: createCategoryDto.label,
      },
    });

    if (existingCategory) {
      throw new ConflictException(
        "Category with the input label is already exist.",
      );
    }

    return await this.categoriesRepository.create(createCategoryDto);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesRepository.update(id, updateCategoryDto);
  }

  async delete({ id }: { id: string }) {
    return await this.categoriesRepository.delete({ id });
  }
}
