import { Module } from "@nestjs/common";

import { RefreshTokensRepository } from "./refresh-tokens.repository";
import { RefreshTokensService } from "./refresh-tokens.service";

@Module({
  providers: [RefreshTokensRepository, RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
