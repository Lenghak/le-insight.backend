import { Injectable } from "@nestjs/common";

import { ArticlesCategoriesRepository } from "@/modules/articles-categories/articles-categories.repository";
import type { ApplyACDTO } from "@/modules/articles-categories/dto/apply-ac.dto";
import type { CreateACDTO } from "@/modules/articles-categories/dto/create-ac.dto";
import type { DeleteACDTO } from "@/modules/articles-categories/dto/delete-ac.dto";
import type { GenerateACDTO } from "@/modules/articles-categories/dto/generate-ac.dto";
import type { GetACAllDTO } from "@/modules/articles-categories/dto/get-ac-all.dto";
import { ArticlesService } from "@/modules/articles/articles.service";
import { CategoriesService } from "@/modules/categories/categories.service";

import * as acSchema from "@/database/models/articles-categories";
import { ArticlesCategoriesType } from "@/database/schemas/articles-categories/articles-categories.type";
import type { DatabaseType } from "@/database/types/db.type";

@Injectable()
export class ArticlesCategoriesService {
  constructor(
    private readonly acRepository: ArticlesCategoriesRepository,
    private readonly articleService: ArticlesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async all(getACListDTO: GetACAllDTO) {
    return await this.acRepository.all(getACListDTO);
  }

  async create(
    createACDTO: CreateACDTO,
    db?: DatabaseType | DatabaseType<typeof acSchema>,
  ) {
    const acs = await this.acRepository.create(createACDTO, db);

    for (const ac of acs) {
      await this.categoriesService.updateCounter({
        category_id: ac.category_id,
        counterType: "assign",
        op: "+",
      });
    }

    return acs;
  }

  async apply({ article, categories }: ApplyACDTO) {
    let categoryOther = await this.categoriesService.get({
      by: "label",
      values: {
        label: "Other",
      },
    });

    if (!categoryOther)
      categoryOther = await this.categoriesService.create({
        label: "Other",
        status: "ACTIVE",
      })[0];

    const bridged: ArticlesCategoriesType[] = [];

    for (const category of categories.sort((a, b) => b.rate - a.rate)) {
      const ligitCategory = await this.categoriesService.get({
        by: "label",
        values: {
          label: category.label,
        },
      });

      if (ligitCategory)
        bridged.push(
          ...(await this.create({
            article_id: article.id,
            category_id: ligitCategory.id,
          })),
        );
    }

    if (bridged.length <= 0 && categoryOther)
      bridged.push(
        ...(await this.create({
          article_id: article.id,
          category_id: categoryOther.id,
        })),
      );

    return bridged;
  }

  async regenerate(generateACDto: GenerateACDTO) {
    const article = await this.articleService.get(generateACDto.article_id);

    const categories = article.content_plain_text
      ? (
          await this.categoriesService.generate({
            article: article.content_plain_text,
          })
        ).data.categories
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
      await this.categoriesService.updateCounter({
        category_id: ac.category_id,
        counterType: "assign",
        op: "-",
      });
    }

    return deletedAcs;
  }
}
