import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";

import paginationHelper from "@/common/helpers/pagination.helper";

import { CategoriesRepository } from "@/modules/categories/categories.repository";
import type { ApplyACDTO } from "@/modules/categories/dto/apply-ac.dto";
import type { CreateACDTO } from "@/modules/categories/dto/create-ac.dto";
import type { CreateCategoryDto } from "@/modules/categories/dto/create-category.dto";
import type { DeleteACDTO } from "@/modules/categories/dto/delete-ac.dto";
import type { GenerateACDTO } from "@/modules/categories/dto/generate-ac.dto";
import type { GenerateCategoriesDTO } from "@/modules/categories/dto/generate-categories.dto";
import type { GetCategoriesListDTO } from "@/modules/categories/dto/get-categories-list.dto";
import type { UpdateCategoryDto } from "@/modules/categories/dto/update-category.dto";
import { ClassificationsService } from "@/modules/classifications/classifications.service";

import * as schema from "@/database/models";
import type { ArticlesCategoriesType } from "@/database/schemas/articles-categories/articles-categories.type";
import type { CategoriesType } from "@/database/schemas/categories/categories.type";
import type { DatabaseType } from "@/database/types/db.type";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
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

    const response = await this.classificationService.categorize({
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

  async bridge(
    createACDTO: CreateACDTO,
    db?: DatabaseType | DatabaseType<typeof schema>,
  ) {
    const acs = await this.categoriesRepository.bridge(createACDTO, db);

    for (const ac of acs) {
      await this.updateCounter({
        category_id: ac.category_id,
        counterType: "assign",
        op: "+",
      });
    }

    return acs;
  }

  async apply({ article, categories }: ApplyACDTO) {
    let categoryOther = await this.get({
      by: "label",
      values: {
        label: "Other",
      },
    });

    if (!categoryOther)
      categoryOther = await this.create({
        label: "Other",
        status: "ACTIVE",
      })[0];

    const bridged: ArticlesCategoriesType[] = [];

    for (const category of categories
      .sort((a, b) => b.rate - a.rate)
      .filter((category) => category.rate > 0.75)
      .slice(0, 3)) {
      const ligitCategory = await this.get({
        by: "label",
        values: {
          label: category.label,
        },
      });

      if (ligitCategory?.id && ligitCategory.status === "ACTIVE")
        bridged.push(
          ...(await this.bridge({
            article_id: article.id,
            category_id: ligitCategory.id,
          })),
        );
    }

    if (bridged.length <= 0 && categoryOther) {
      bridged.push(
        ...(await this.bridge({
          article_id: article.id,
          category_id: categoryOther.id,
        })),
      );
    }

    return bridged;
  }

  async regenerate(generateACDto: GenerateACDTO) {
    if (!generateACDto.article)
      throw new UnprocessableEntityException(
        "Cannot find article with the current ID",
      );

    const categories = generateACDto.article.content_plain_text
      ? (
          await this.generate({
            article: generateACDto.article.content_plain_text,
          })
        ).categories
      : [
          {
            label: "Other",
            rate: 1.0,
          },
        ];

    await this.detach({
      article_id: generateACDto.article.id,
    });
    return await this.apply({ article: generateACDto.article, categories });
  }

  async detach(deleteACDTO: DeleteACDTO) {
    const deletedAcs = await this.categoriesRepository.break(deleteACDTO);

    for (const ac of deletedAcs) {
      await this.updateCounter({
        category_id: ac.category_id,
        counterType: "assign",
        op: "-",
      });
    }

    return deletedAcs;
  }
}
