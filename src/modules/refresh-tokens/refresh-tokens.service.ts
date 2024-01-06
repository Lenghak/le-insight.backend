import { Injectable } from "@nestjs/common";

import { type SignOutDTO } from "../auth/dto/sign-out.dto";
import { RefreshTokensRepository } from "./refresh-tokens.repository";
import { type UpdateRefreshTokensDTO } from "./update-refresh-tokens.dto";

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async update(updateRefreshTokensDTO: UpdateRefreshTokensDTO) {
    return await this.refreshTokensRepository
      .update(updateRefreshTokensDTO)
      .execute();
  }

  async delete(signOutDTO: SignOutDTO) {
    return await this.refreshTokensRepository.delete(signOutDTO).execute();
  }
}
