import { Module } from "@nestjs/common";

import { ProvidersService } from "@/modules/providers/providers.service";

import { DrizzleModule } from "@/database/drizzle.module";

import { ProvidersRepository } from "./providers.respository";

@Module({
  imports: [DrizzleModule],
  providers: [ProvidersRepository, ProvidersService],
  exports: [ProvidersRepository, ProvidersService],
})
export class ProvidersModule {}
