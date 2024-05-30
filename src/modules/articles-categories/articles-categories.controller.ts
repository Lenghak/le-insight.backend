import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UnprocessableEntityException,
} from "@nestjs/common";

import { Public } from "@/common/decorators/public.decorator";
import { User } from "@/common/decorators/user.decorator";

import { ArticlesCategoriesService } from "@/modules/articles-categories/articles-categories.service";
import type { ApplyACDTO } from "@/modules/articles-categories/dto/apply-ac.dto";
import type { CreateArticlesDTO } from "@/modules/articles-categories/dto/create-articles.dto";
import type { GenerateACDTO } from "@/modules/articles-categories/dto/generate-ac.dto";
import { ArticlesSerializer } from "@/modules/articles/articles.serializer";
import { ArticlesService } from "@/modules/articles/articles.service";
import type { ArticlesListDTO } from "@/modules/articles/dto/articles-list.dto";
import type { PayloadType } from "@/modules/auth/types/payload.type";
import type {
  GetModelDto,
  ModelEnumType,
} from "@/modules/llm/dto/get-model.dto";

@Controller("/articles-categories")
export class ArticlesCategoriesController {
  constructor(
    private readonly acService: ArticlesCategoriesService,
    private readonly articleService: ArticlesService,
    private readonly articleSerializer: ArticlesSerializer,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get("/")
  async list(@Query() params: ArticlesListDTO) {
    const articles = await this.acService.list(params);
    return articles;
  }

  @Post("/apply")
  async apply(@Body() { article, categories }: ApplyACDTO) {
    return await this.acService.apply({ article, categories });
  }

  @Post("/regenerate")
  async regenerate(
    @Body() generateACDto: GenerateACDTO,
    @Query() _model: GetModelDto,
  ) {
    return this.acService.regenerate(generateACDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("/")
  async create(
    @User() payload: PayloadType,
    @Body() createArticleDTO: CreateArticlesDTO,
    @Query() _model: ModelEnumType,
  ) {
    const userID = payload.sub;
    const article = await this.articleService.create(userID, createArticleDTO);

    if (!article)
      throw new UnprocessableEntityException("Article cannot be created");

    const categories =
      createArticleDTO.categories ??
      (await this.acService.regenerate({
        article_id: article.at(0)?.id ?? "",
        category_id: "",
      }));

    this.apply({
      article: article[0],
      categories,
    });

    return this.articleSerializer.serialize(article);
  }
}
