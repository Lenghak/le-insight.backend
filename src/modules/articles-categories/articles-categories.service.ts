import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import paginationHelper from "@/common/helpers/pagination.helper";

import { ArticlesCategoriesRepository } from "@/modules/articles-categories/articles-categories.repository";
import type { ApplyACDTO } from "@/modules/articles-categories/dto/apply-ac.dto";
import type { CreateACDTO } from "@/modules/articles-categories/dto/create-ac.dto";
import type { DeleteACDTO } from "@/modules/articles-categories/dto/delete-ac.dto";
import type { GenerateACDTO } from "@/modules/articles-categories/dto/generate-ac.dto";
import type { GetACAllDTO } from "@/modules/articles-categories/dto/get-ac-all.dto";
import { ArticlesService } from "@/modules/articles/articles.service";
import type { ArticlesListDTO } from "@/modules/articles/dto/articles-list.dto";
import { CategoriesService } from "@/modules/categories/categories.service";

import * as schema from "@/database/models";
import { ArticlesCategoriesType } from "@/database/schemas/articles-categories/articles-categories.type";
import type { DatabaseType } from "@/database/types/db.type";

@Injectable()
export class ArticlesCategoriesService {
  constructor(
    private readonly acRepository: ArticlesCategoriesRepository,
    private readonly articleService: ArticlesService,
    private readonly categoryService: CategoriesService,
  ) {}

  async all(getACListDTO: GetACAllDTO) {
    return await this.acRepository.all(getACListDTO);
  }

  async list({ limit = 50, page, status, ...params }: ArticlesListDTO) {
    const category = params.category
      ? await this.categoryService.get({
          by: "label",
          values: {
            label: params.category,
          },
        })
      : undefined;

    const count = (
      await this.acRepository.count({
        limit,
        offset: 0,
        status,
        ...params,
        categoryId: category?.id,
      })
    )[0].value;

    const { hasNextPage, hasPreviousPage, offset, totalPages } =
      paginationHelper({ count, limit, page });

    const articles = await this.acRepository.list({
      limit,
      offset,
      status,
      ...params,
      categoryId: category?.id,
    });

    return {
      data: articles,
      meta: {
        count,
        page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async create(
    createACDTO: CreateACDTO,
    db?: DatabaseType | DatabaseType<typeof schema>,
  ) {
    const acs = await this.acRepository.create(createACDTO, db);

    for (const ac of acs) {
      await this.categoryService.updateCounter({
        category_id: ac.category_id,
        counterType: "assign",
        op: "+",
      });
    }

    return acs;
  }

  async apply({ article, categories }: ApplyACDTO) {
    let categoryOther = await this.categoryService.get({
      by: "label",
      values: {
        label: "Other",
      },
    });

    if (!categoryOther)
      categoryOther = await this.categoryService.create({
        label: "Other",
        status: "ACTIVE",
      })[0];

    const bridged: ArticlesCategoriesType[] = [];

    for (const category of categories
      .sort((a, b) => b.rate - a.rate)
      .filter((category) => category.rate > 0.75)) {
      let ligitCategory = await this.categoryService.get({
        by: "label",
        values: {
          label: category.label,
        },
      });
      if (category.rate >= 0.8 && !ligitCategory?.id)
        ligitCategory = await this.categoryService.create({
          label: category.label,
          status: "ACTIVE",
        })[0];

      if (ligitCategory?.id)
        bridged.push(
          ...(await this.create({
            article_id: article.id,
            category_id: ligitCategory.id,
          })),
        );
    }

    if (bridged.length <= 0 && categoryOther) {
      bridged.push(
        ...(await this.create({
          article_id: article.id,
          category_id: categoryOther.id,
        })),
      );
    }

    return bridged;
  }

  async regenerate(generateACDto: GenerateACDTO) {
    const article = await this.articleService.get(
      generateACDto.article_id ?? "",
    );

    if (!article)
      throw new UnprocessableEntityException(
        "Cannot find article with the current ID",
      );

    const categories = article.content_plain_text
      ? (
          await this.categoryService.generate({
            article: article.content_plain_text,
          })
        ).categories
      : [
          {
            label: "Other",
            rate: 1.0,
          },
        ];

    await this.detach({
      article_id: article.id,
    });
    return await this.apply({ article, categories });
  }

  async detach(deleteACDTO: DeleteACDTO) {
    const deletedAcs = await this.acRepository.delete(deleteACDTO);

    for (const ac of deletedAcs) {
      await this.categoryService.updateCounter({
        category_id: ac.category_id,
        counterType: "assign",
        op: "-",
      });
    }

    return deletedAcs;
  }
}
