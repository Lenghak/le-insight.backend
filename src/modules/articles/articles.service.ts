import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

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
    // private readonly httpService: HttpService,
  ) {}

  // async list({ limit = 50, page, status, ...params }) {
  //   const count = (await this.count(params.q))[0].value;
  //   const { hasNextPage, hasPreviousPage, offset, totalPages } =
  //     paginationHelper({ count, limit, page });

  //   const categories = await this.categoriesRepository.list({
  //     limit,
  //     offset,
  //     status,
  //     ...params,
  //   });

  //   return {
  //     data: categories,
  //     meta: {
  //       count,
  //       page,
  //       totalPages,
  //       hasNextPage,
  //       hasPreviousPage,
  //     },
  //   };
  // }

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
