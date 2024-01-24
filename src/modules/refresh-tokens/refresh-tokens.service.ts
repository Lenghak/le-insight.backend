import { Injectable } from "@nestjs/common";

import { type DatabaseType } from "@/database/types/db.types";

import { type SignOutDTO } from "../auth/dto/sign-out.dto";
import { type CreateRefreshTokensDTO } from "./dto/create-refresh-tokens.dto";
import { type UpdateRefreshTokensDTO } from "./dto/update-refresh-tokens.dto";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async create(
    createRefreshTokenDTO: CreateRefreshTokensDTO,
    db?: DatabaseType,
  ) {
    return await this.refreshTokensRepository.create(db).execute({
      userID: createRefreshTokenDTO.userID,
      sessionID: createRefreshTokenDTO.sessionID,
      token: createRefreshTokenDTO.token,
    });
  }

  async update(
    updateRefreshTokensDTO: UpdateRefreshTokensDTO,
    db?: DatabaseType,
  ) {
    return await this.refreshTokensRepository
      .update(updateRefreshTokensDTO, db)
      .execute({
        userID: updateRefreshTokensDTO.userID,
      });
  }

  async delete(signOutDTO: SignOutDTO, db?: DatabaseType) {
    return await this.refreshTokensRepository.delete(db).execute({
      userID: signOutDTO.userID,
    });
  }
}
