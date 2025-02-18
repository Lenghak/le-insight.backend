import { HttpModule } from "@nestjs/axios";
import { BullModule } from "@nestjs/bullmq";
import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AccessTokenGuard } from "@/common/guards/access-token.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { jsonAPISerializerProvider } from "@/common/serializers/json-api-serializer.provider";

import { ArticlesModules } from "@/modules/articles/articles.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { CategoriesModule } from "@/modules/categories/categories.module";
import { ClassificationsModule } from "@/modules/classifications/classifications.module";
import { EnhancementsModule } from "@/modules/enhancements/enchancement.module";
import { LlmModule } from "@/modules/llm/llm.module";
import { MailModule } from "@/modules/mail/mail.module";
import { OAuthModule } from "@/modules/oauth/oauth.module";
import { ProfilesModule } from "@/modules/profiles/profiles.module";
import { SensitivitiesModule } from "@/modules/sensitivities/sensitivities.module";
import { UsersModule } from "@/modules/users/users.module";

import { DrizzleModule } from "@/database/drizzle.module";

import { env } from "@/core/env";

import { LoggerMiddleware } from "./app.middleware";

@Module({
  imports: [
    // Config configuration modules
    ConfigModule.forRoot({
      envFilePath: [".env"],
      load: [() => env],
      isGlobal: true,
      cache: true,
    }),

    // Config Rate Limiting
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000,
        limit: 5,
      },
      {
        name: "medium",
        ttl: 10000,
        limit: 25,
      },
      {
        name: "long",
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Config caching mechanism
    // CacheModule.registerAsync<RedisClientOptions>({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     store: (await redisStore({
    //       url: configService.get("REDIS_URL"),
    //       ttl: configService.get("REDIS_TTL"),
    //     })) as unknown as CacheStore,
    //   }),
    //   isGlobal: true,
    // }),

    // Config queue mechanism
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          redisOptions: {
            host: configService.get("QUEUE_HOST"),
            username: configService.get("QUEUE_USERNAME"),
            password: configService.get("QUEUE_PASSWORD"),
            port: configService.get("QUEUE_PORT"),
          },
          limiter: {
            bounceBack: true,
            duration: 60 * 60 * 1000,
            max: 100,
          },
        },
      }),
    }),

    HttpModule.registerAsync({
      useFactory: async () => ({
        maxRedirects: 3,
        timeout: 0,
        headers: {
          "Content-Type": "applicatin/json",
        },
      }),
    }),

    // modules
    DrizzleModule,
    ArticlesModules,
    AuthModule,
    OAuthModule,
    CategoriesModule,
    ClassificationsModule,
    EnhancementsModule,
    LlmModule,
    MailModule,
    SensitivitiesModule,
    ProfilesModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    jsonAPISerializerProvider,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/*");
  }
}
