import { Module } from "@nestjs/common";

import { DrizzleModule } from "@/database/drizzle.module";

import { RefreshTokensRepository } from "./refresh-tokens.repository";
import { RefreshTokensService } from "./refresh-tokens.service";

@Module({
  imports: [DrizzleModule],
  providers: [RefreshTokensRepository, RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
