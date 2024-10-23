import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { fastifyCompress } from "@fastify/compress";
import { fastifyCookie } from "@fastify/cookie";
import { fastifyCsrfProtection } from "@fastify/csrf-protection";
import { fastifyHelmet } from "@fastify/helmet";
import { fastifySecureSession } from "@fastify/secure-session";

import { SerializedHTTPExceptionFilter } from "@/common/filters/serialized-http.filter";
import { JSON_API_SERIALIZER } from "@/common/serializers/json-api-serializer.provider";

import { ZodValidationPipe } from "nestjs-zod";

import { AppModule } from "./app.module";

/**
 * The `bootstrap` function sets up a NestJS application, creates a Swagger document for API
 * documentation, and starts the application on port 8000.
 */
async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    trustProxy: ["0.0.0.0"],
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
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

  await app.register(fastifyCompress, {
    global: true,
    encodings: ["gzip", "deflate"],
  });

  await app.register(fastifyCookie, {
    secret: await configService.get("COOKIE_SECRET"),
  });

  await app.register(fastifySecureSession, {
    secret: await configService.get("SESSION_SECRET"),
    salt: await configService.get("SESSION_SALT"),
  });

  await app.register(fastifyHelmet, { global: true });

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
      (await configService.get("HOST_URL")) ?? "0.0.0.0",
      (await configService.get("CLIENT_URL")) ?? "http://localhost:4000",
      (await configService.get("ADMIN_URL")) ?? "http://localhost:3000",
    ],
    allowedHeaders: "*",
    credentials: true,
  });

  app.setGlobalPrefix("/v1/api");

  // listening to port 8000 or default from prod
  await app.listen(
    (await configService.get("PORT")) ?? 8000,
    (await configService.get("HOST_URL")) ?? "http://localhost",
    undefined,
  );
}

bootstrap();
