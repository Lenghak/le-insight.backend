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
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

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

    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000,
        limit: 3,
      },
      {
        name: "medium",
        ttl: 10000,
        limit: 20,
      },
      {
        name: "long",
        ttl: 60000,
        limit: 100,
      },
    ]),

    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: (await redisStore({
          url: configService.get("REDIS_URL"),
          ttl: configService.get("REDIS_TTL"),
        })) as unknown as CacheStore,
        isGlobal: true,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/*");
  }
}
