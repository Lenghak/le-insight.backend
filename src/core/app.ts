import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { SerializedHTTPExceptionFilter } from "@/common/filters/serialized-http.filter";
import { JSON_API_SERIALIZER } from "@/common/serializers/json-api-serializer.provider";

import { fastifyCompress } from "@fastify/compress";
import { fastifyCookie } from "@fastify/cookie";
import { fastifyCsrfProtection } from "@fastify/csrf-protection";
import { fastifyHelmet } from "@fastify/helmet";
import { fastifySecureSession } from "@fastify/secure-session";
import { ZodValidationPipe } from "nestjs-zod";

import { AppModule } from "./app.module";

/**
 * The `bootstrap` function sets up a NestJS application, creates a Swagger document for API
 * documentation, and starts the application on port 8000.
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: ["0.0.0.0"],
    }),
  );
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new SerializedHTTPExceptionFilter(
      app.get(JSON_API_SERIALIZER),
      configService,
    ),
  );

  // @ts-expect-error ... uncompitable with FastifyPlugin<...>
  await app.register(fastifyCompress, {
    global: true,
    encodings: ["gzip", "deflate"],
  });

  // @ts-expect-error ... uncompitable with FastifyPlugin<...>
  await app.register(fastifyCookie, {
    secret: await configService.get("COOKIE_SECRET"),
  });

  // @ts-expect-error ... uncompitable with FastifyPlugin<...>
  await app.register(fastifySecureSession, {
    secret: await configService.get("SESSION_SECRET"),
    salt: await configService.get("SESSION_SALT"),
  });

  // @ts-expect-error ... uncompitable with FastifyPlugin<...>
  await app.register(fastifyHelmet, { global: true });

  // @ts-expect-error ... uncompitable with FastifyPlugin<...>
  await app.register(fastifyCsrfProtection, {
    sessionPlugin: "@fastify/secure-session",
    cookieOpts: {
      signed: true,
      httpOnly: true,
      secure: (await configService.get("NODE_ENV")) === "Production",
    },
  });

  app.enableCors({
    origin: [
      (await configService.get("HOSTNAME")) ?? "0.0.0.0",
      (await configService.get("CLIENT_HOSTNAME")) ?? "http://localhost:4000",
      (await configService.get("ADMIN_HOSTNAME")) ?? "http://localhost:3000",
    ],
    allowedHeaders: "*",
    credentials: true,
  });

  app.setGlobalPrefix("/v1/api");

  // listening to port 8000 or default from prod
  await app.listen(
    (await configService.get("PORT")) ?? 8000,
    (await configService.get("HOSTNAME")) ?? "0.0.0.0",
    undefined,
  );
}

bootstrap();
