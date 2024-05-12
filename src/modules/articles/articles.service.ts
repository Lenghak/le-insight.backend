import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import paginationHelper from "@/common/helpers/pagination.helper";

import type { ArticlesListDTO } from "@/modules/articles/dto/articles-list.dto";
import { UsersService } from "@/modules/users/users.service";

import { compareAsc } from "date-fns";

import { ArticlesRepository } from "./articles.repository";
import type { CreateArticlesDTO } from "./dto/create-articles.dto";
import type { DeleteArticlesDTO } from "./dto/delete-articles.dto";
import type { UpdateArticlesDTO } from "./dto/update-articles.dto";

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articleRepository: ArticlesRepository,
    private readonly usersService: UsersService,
  ) {}

  async list({ limit = 50, page, status, ...params }: ArticlesListDTO) {
    const count = (await this.count(params.q))[0].value;
    const { hasNextPage, hasPreviousPage, offset, totalPages } =
      paginationHelper({ count, limit, page });

    const articles = await this.articleRepository.list({
      limit,
      offset,
      status,
      ...params,
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

  async count(q?: string) {
    return await this.articleRepository.count(q);
  }

  async create(authorID: string, createArticleDTO: CreateArticlesDTO) {
    const currentAuthor = await this.usersService.get({
      by: "id",
      values: {
        id: authorID,
      },
    });

    if (!currentAuthor) {
      throw new UnauthorizedException();
    }

    if (
      currentAuthor.banned_until &&
      compareAsc(new Date(), new Date(currentAuthor.banned_until))
    ) {
      throw new ForbiddenException();
    }

    return await this.articleRepository.create({
      user_id: currentAuthor?.id,
      ...createArticleDTO,
    });
  }

  async update(updateArticleDTO: UpdateArticlesDTO) {
    return await this.articleRepository.update(updateArticleDTO);
  }

  async delete(deleteArticleDTO: DeleteArticlesDTO) {
    return await this.articleRepository.delete(deleteArticleDTO);
  }
}
