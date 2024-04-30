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

import { ArticlesService } from "@/modules/articles/articles.service";
import { AuthSerializer } from "@/modules/auth/auth.serializer";

import { createAuthToken } from "@portive/auth";

import { ArticlesSerializer } from "./articles.serializer";
import { CreateArticlesDTO } from "./dto/create-articles.dto";
import { DeleteArticlesDTO } from "./dto/delete-articles.dto";
import { UpdateArticlesDTO } from "./dto/update-articles.dto";

@Controller({ path: "/articles" })
export class ArticlesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly articleSerialzer: ArticlesSerializer,
    private readonly articleService: ArticlesService,
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
    const article = await this.articleService.create(createArticleDTO);
    return this.articleSerialzer.serialize(article);
  }

  @HttpCode(HttpStatus.OK)
  @Patch("/:id")
  async update(@Body() updateArticleDTO: UpdateArticlesDTO) {
    const article = await this.articleService.update(updateArticleDTO);
    return this.articleSerialzer.serialize(article);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("/:id")
  async delete(@Param() deleteArticleDTO: DeleteArticlesDTO) {
    const article = await this.articleService.delete(deleteArticleDTO);
    return this.articleSerialzer.serialize(article);
  }
}
