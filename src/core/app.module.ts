import {
  CacheInterceptor,
  CacheModule,
  type CacheStore,
} from "@nestjs/cache-manager";
import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { AuthModule } from "@/modules/auth/auth.module";
import { ProfilesModule } from "@/modules/profiles/profiles.module";
import { UsersModule } from "@/modules/users/users.module";

import { DrizzleModule } from "@/database/drizzle.module";

import { envSchema } from "@/core/env";
import { redisStore } from "cache-manager-redis-store";
import { type RedisClientOptions } from "redis";

import { LoggerMiddleware } from "./app.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      validationSchema: envSchema,
      validate: envSchema.parse,
      isGlobal: true,
    }),

    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore({
          socket: {
            host: configService.get("REDIS_HOST"),
            port: +configService.get("REDIS_PORT"),
          },
          ttl: configService.get("REDIS_TTL"),
        }) as unknown as CacheStore,
      }),
    }),

    AuthModule,
    DrizzleModule,
    UsersModule,
    ProfilesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/*");
  }
}
