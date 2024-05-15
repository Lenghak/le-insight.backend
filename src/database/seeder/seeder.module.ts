import { Logger, Module } from "@nestjs/common";

import { CategoriesModule } from "@/modules/categories/categories.module";

import { DrizzleModule } from "../drizzle.module";

@Module({
  imports: [DrizzleModule, CategoriesModule],
  providers: [Logger],
})
export class SeederModule {}
