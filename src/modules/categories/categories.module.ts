import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CategoriesController } from "@/modules/categories/categories.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [CategoriesController],
  providers: [],
})
export class CategoriesModule {}
