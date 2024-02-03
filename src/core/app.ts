import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AuthModule } from "@/modules/auth/auth.module";
import { UsersModule } from "@/modules/users/users.module";

import { fastifyCompress } from "@fastify/compress";
import { fastifyCookie } from "@fastify/cookie";
import { fastifyCsrfProtection } from "@fastify/csrf-protection";
import { fastifyHelmet } from "@fastify/helmet";
import { fastifySecureSession } from "@fastify/secure-session";
import { patchNestJsSwagger, ZodValidationPipe } from "nestjs-zod";

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

  // @ts-expect-error typeof fastifyCompress does not assignable to type FastifyPluginCallback
  await app.register(fastifyCompress, {
    global: true,
    encodings: ["gzip", "deflate"],
  });

  // @ts-expect-error typeof cookie does not assignable to type FastifyPluginCallback
  await app.register(fastifyCookie, {
    secret: await configService.get("COOKIE_SECRET"),
  });

  // @ts-expect-error typeof secreSession does not assignable to type FastifyPluginCallback
  await app.register(fastifySecureSession, {
    secret: await configService.get("SESSION_SECRET"),
    salt: await configService.get("SESSION_SALT"),
  });

  // @ts-expect-error typeof helmet does not assignable to type FastifyPluginCallback
  await app.register(fastifyHelmet, { global: true });

  // @ts-expect-error typeof csrf does not assignable to type FastifyPluginCallback
  await app.register(fastifyCsrfProtection, {
    sessionPlugin: fastifySecureSession,
  });

  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix("/v1/api");

  // patch the version of swagger to match the nestjs-zod
  patchNestJsSwagger();

  // swagger document builder
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Le-Insight")
    .setDescription(
      "Le-Insight is a dynamic knowledge sharing platform that serves as a hub for writers, experts, and enthusiasts to share their insights, experiences, and expertise with a global audience. With its intuitive interface and user-friendly features, Le-Insight empowers individuals to publish, discover, and engage with high-quality articles spanning a wide range of topics. Whether you're passionate about technology, business, arts, or any other subject, Le-Insight provides a vibrant community where users can explore thought-provoking content, connect with like-minded individuals, and foster meaningful discussions. With its emphasis on fostering creativity, collaboration, and knowledge exchange, Le-Insight is the go-to platform for both aspiring and established writers to showcase their talent and make a lasting impact in the world of online publishing.",
    )
    .setVersion("0.1.0")
    // add access-token auth for swagger
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: "Authorization",
        bearerFormat: "Bearer",
        scheme: "Bearer",
        type: "http",
        in: "Header",
      },
      "access-token",
    )
    // add refresh-token auth for swagger
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: "Authorization",
        bearerFormat: "Bearer",
        scheme: "Bearer",
        type: "http",
        in: "Header",
      },
      "refresh-token",
    )
    .build();

  // init docs from controllers
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [AppModule, AuthModule, UsersModule], //the modules that you want to include in your swagger docs
  });

  // setup swagger
  SwaggerModule.setup("docs", app, document);

  // listening to port 8000 or default from prod
  await app.listen(
    (await configService.get("PORT")) ?? 8000,
    (await configService.get("HOSTNAME")) ?? "0.0.0.0",
    undefined,
  );
}

bootstrap();
