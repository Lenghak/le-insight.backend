import { Logger, Module } from "@nestjs/common";

import { CategoriesModule } from "@/modules/categories/categories.module";
import { CategoriesRepository } from "@/modules/categories/categories.repository";
import { CategoriesService } from "@/modules/categories/categories.service";

import { SeederService } from "@/database/seeder/seeder.service";

import { DrizzleModule } from "../drizzle.module";

@Module({
  imports: [DrizzleModule, CategoriesModule],
  providers: [Logger, SeederService, CategoriesService, CategoriesRepository],
})
export class SeederModule {}
