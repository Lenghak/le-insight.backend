import { Module } from "@nestjs/common";

import { drizzleProvider } from "./drizzle.service";

@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DrizzleModule {}
