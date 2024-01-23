import { Injectable } from "@nestjs/common";

import { type SignOutDTO } from "../auth/dto/sign-out.dto";
import { type UpdateRefreshTokensDTO } from "./dto/update-refresh-tokens.dto";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async create() {}

  async update(updateRefreshTokensDTO: UpdateRefreshTokensDTO) {
    return await this.refreshTokensRepository
      .update(updateRefreshTokensDTO)
      .execute({
        userID: updateRefreshTokensDTO.userID,
      });
  }

  async delete(signOutDTO: SignOutDTO) {
    return await this.refreshTokensRepository.delete().execute({
      userID: signOutDTO.userID,
    });
  }
}
