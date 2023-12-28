import { Injectable } from "@nestjs/common";

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
}
