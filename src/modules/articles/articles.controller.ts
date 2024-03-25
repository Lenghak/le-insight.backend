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
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ArticlesRepository } from "@/modules/articles/articles.repository";
import { ArticlesSerializer } from "@/modules/articles/articles.serializer";
import { CreateArticlesDTO } from "@/modules/articles/dto/create-articles.dto";
import { DeleteArticlesDTO } from "@/modules/articles/dto/delete-articles.dto";
import { UpdateArticlesDTO } from "@/modules/articles/dto/update-articles.dto";
import { AuthSerializer } from "@/modules/auth/auth.serializer";

import { createAuthToken } from "@portive/auth";

@Controller({ path: "/articles" })
export class ArticlesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly articleSerialzer: ArticlesSerializer,
    private readonly articleRepository: ArticlesRepository,
    private readonly authSerializer: AuthSerializer,
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

  @HttpCode(HttpStatus.CREATED)
  @Post("/")
  async create(@Body() createArticleDTO: CreateArticlesDTO) {
    const article = await this.articleRepository.create(createArticleDTO);
    return this.articleSerialzer.serialize(article);
  }

  @HttpCode(HttpStatus.OK)
  @Patch("/:id")
  async update(@Body() updateArticleDTO: UpdateArticlesDTO) {
    const article = await this.articleRepository.update(updateArticleDTO);
    return this.articleSerialzer.serialize(article);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("/:id")
  async delete(@Param() deleteArticleDTO: DeleteArticlesDTO) {
    const article = await this.articleRepository.delete(deleteArticleDTO);
    return this.articleSerialzer.serialize(article);
  }
}
