import { Module } from "@nestjs/common";

import { DrizzleModule } from "@/database/drizzle.module";

import { ProfilesRepository } from "./profiles.repository";
import { ProfilesService } from "./profiles.service";

@Module({
  imports: [DrizzleModule],
  providers: [ProfilesRepository, ProfilesService],
})
export class ProfilesModule {}
