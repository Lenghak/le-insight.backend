import { HttpService } from "@nestjs/axios";
import { ConflictException, Injectable } from "@nestjs/common";

import paginationHelper from "@/common/helpers/pagination.helper";

import { CategoriesRepository } from "@/modules/categories/categories.repository";
import type { CreateCategoryDto } from "@/modules/categories/dto/create-category.dto";
import type { GenerateCategoriesDTO } from "@/modules/categories/dto/generate-categories.dto";
import type { GetCategoriesListDTO } from "@/modules/categories/dto/get-categories-list.dto";
import type { UpdateCategoryDto } from "@/modules/categories/dto/update-category.dto";
import { ClassificationsService } from "@/modules/classifications/classifications.service";

import type { CategoriesType } from "@/database/schemas/categories/categories.type";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly httpService: HttpService,
    private readonly classificationService: ClassificationsService,
  ) {}

  async list({
    limit = 50,
    page = 1,
    status,
    ...params
  }: GetCategoriesListDTO) {
    const count = (await this.count({ q: params.q, status }))[0].value;
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

  async count({ q, status }: GetCategoriesListDTO) {
    return await this.categoriesRepository.count({ q, status });
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

  async all(columns?: Record<string, true>) {
    return await this.categoriesRepository.all(columns);
  }

  async generate(generateCategoriesDTO: GenerateCategoriesDTO) {
    const categories = (await this.all()).sort();

    const response = await this.classificationService.generate({
      article: generateCategoriesDTO.article,
      categories: categories.map((cat) => cat.label),
    });

    response.categories.map(async (cate) => {
      const currCate = await this.get({
        by: "label",
        values: { label: cate.label },
      });

      if (currCate)
        await this.updateCounter({
          category_id: currCate?.id,
          counterType: "generate",
          op: "+",
        });
    });

    return response;
  }

  async updateCounter({
    category_id,
    counterType,
    op,
  }: {
    category_id: string;
    counterType: "assign" | "generate";
    op: "+" | "-";
  }) {
    const currCate = await this.get({
      by: "id",
      values: { id: category_id },
    });

    return await this.update(category_id, {
      assigned_count:
        counterType === "assign"
          ? (currCate?.assigned_count ?? 0) + (op === "+" ? 1 : -1)
          : undefined,
      generated_count:
        counterType === "generate"
          ? (currCate?.generated_count ?? 0) + (op === "+" ? 1 : -1)
          : undefined,
    });
  }
}
