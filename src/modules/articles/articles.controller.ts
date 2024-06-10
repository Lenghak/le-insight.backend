import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Public } from "@/common/decorators/public.decorator";
import { User } from "@/common/decorators/user.decorator";

import { ArticlesService } from "@/modules/articles/articles.service";
import type { ArticlesListDTO } from "@/modules/articles/dto/articles-list.dto";
import type { CreateArticlesDTO } from "@/modules/articles/dto/create-articles.dto";
import { AuthSerializer } from "@/modules/auth/auth.serializer";
import type { PayloadType } from "@/modules/auth/types/payload.type";
import { CategoriesService } from "@/modules/categories/categories.service";
import type { RegenerateACDTO } from "@/modules/categories/dto/generate-ac.dto";
import type {
  GetModelDto,
  ModelEnumType,
} from "@/modules/llm/dto/get-model.dto";
import { SensitivitiesService } from "@/modules/sensitivities/sensitivities.service";

import { createAuthToken } from "@portive/auth";

import { ArticlesSerializer } from "./articles.serializer";
import { DeleteArticlesDTO } from "./dto/delete-articles.dto";
import { UpdateArticlesDTO } from "./dto/update-articles.dto";

@Controller({ path: "/articles" })
export class ArticlesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly articleSerializer: ArticlesSerializer,
    private readonly articleService: ArticlesService,
    private readonly authSerializer: AuthSerializer,
    private readonly categoriesService: CategoriesService,
    private readonly sensitivitiesService: SensitivitiesService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get("/cloud")
  async getCloudAuthToken() {
    if (!this.configService.get("PORTIVE_API_KEY"))
      throw new InternalServerErrorException("Cannot Connect to Portive Cloud");

    const token = createAuthToken(
      this.configService.get("PORTIVE_API_KEY") ?? "",
      {
        expiresIn: "24h",
      },
    );

    return this.authSerializer.serialize({ token });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get("/")
  async list(@Query() params: ArticlesListDTO) {
    const articles = await this.articleService.list(params);
    return articles;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get("/:id")
  async get(@Param("id") id: string) {
    const articles = await this.articleService.get(id);
    return this.articleSerializer.serialize(articles);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("/")
  async create(
    @User() payload: PayloadType,
    @Body() createArticleDTO: CreateArticlesDTO,
    @Query() _model: ModelEnumType,
  ) {
    const userID = payload.sub;
    const article = (
      await this.articleService.create(userID, createArticleDTO)
    )?.at(0);

    if (!article)
      throw new UnprocessableEntityException("Article cannot be created");

    this.categoriesService.regenerate({
      article: article,
    });

    this.sensitivitiesService.regenerate({
      article: article,
    });

    return this.articleSerializer.serialize(article);
  }

  @HttpCode(HttpStatus.OK)
  @Patch("/:id")
  async update(
    @Param("id") id: string,
    @Body() updateArticleDTO: UpdateArticlesDTO,
  ) {
    const article = await this.articleService.update(id, updateArticleDTO);
    return this.articleSerializer.serialize(article);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("/:id")
  async delete(@Param() deleteArticleDTO: DeleteArticlesDTO) {
    const article = await this.articleService.delete(deleteArticleDTO);
    return this.articleSerializer.serialize(article);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/recategorize")
  async recategorize(
    @Body() regenerateACDto: RegenerateACDTO,
    @Query() _model: GetModelDto,
  ) {
    const article = await this.articleService.get(regenerateACDto.article_id);
    return await this.categoriesService.regenerate({ article });
  }

  @HttpCode(HttpStatus.OK)
  @Post("/resensitize")
  async resensitize(
    @Body() regenerateACDto: RegenerateACDTO,
    @Query() _model: GetModelDto,
  ) {
    const article = await this.articleService.get(regenerateACDto.article_id);
    return await this.sensitivitiesService.regenerate({ article });
  }
}
