import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AuthModule } from "@/modules/auth/auth.module";
import { UsersModule } from "@/modules/users/users.module";

import fastifyCompress from "@fastify/compress";
import secureSession from "@fastify/secure-session";
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

  await app.register(fastifyCompress, {
    global: true,
    encodings: ["gzip", "deflate"],
  });

  await app.register(secureSession, {
    secret: "averylogphrasebiggerthanthirtytwochars",
    salt: "mq9hDxBVDbspDR6n",
  });

  app.enableCors();
  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix("/v1/api");

  patchNestJsSwagger();

  const configService = app.get(ConfigService);

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Le-Insight")
    .setDescription(
      "Le-Insight is a dynamic knowledge sharing platform that serves as a hub for writers, experts, and enthusiasts to share their insights, experiences, and expertise with a global audience. With its intuitive interface and user-friendly features, Le-Insight empowers individuals to publish, discover, and engage with high-quality articles spanning a wide range of topics. Whether you're passionate about technology, business, arts, or any other subject, Le-Insight provides a vibrant community where users can explore thought-provoking content, connect with like-minded individuals, and foster meaningful discussions. With its emphasis on fostering creativity, collaboration, and knowledge exchange, Le-Insight is the go-to platform for both aspiring and established writers to showcase their talent and make a lasting impact in the world of online publishing.",
    )
    .setVersion("0.1.0")
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: "Authorization",
        bearerFormat: "Bearer",
        scheme: "Bearer",
        type: "http",
        in: "Header",
      },
      "access-token", // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: "Authorization",
        bearerFormat: "Bearer",
        scheme: "Bearer",
        type: "http",
        in: "Header",
      },
      "refresh-token", // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [AppModule, AuthModule, UsersModule], //the modules that you want to include in your swagger docs
  });

  SwaggerModule.setup("docs", app, document);

  await app.listen(
    configService.get("PORT") ?? 8000,
    configService.get("HOSTNAME") ?? "0.0.0.0",
    undefined,
  );
}

bootstrap();
