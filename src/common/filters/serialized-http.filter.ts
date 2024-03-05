import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Inject,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { JSON_API_SERIALIZER } from "@/common/serializers/json-api-serializer.provider";

import { type FastifyReply } from "fastify/types/reply";
import JSONAPISerializer from "json-api-serializer";

@Catch(Error)
export class SerializedHTTPExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(JSON_API_SERIALIZER) private readonly serializer: JSONAPISerializer,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const rep = ctx.getResponse<FastifyReply>();

    this.configService.get("NODE_ENV") === "development" &&
      Logger.error(exception.message, exception.stack);

    rep.status(
      exception instanceof HttpException ? exception.getStatus() : 500,
    );

    return rep.send(
      this.serializer.serializeError({
        ...exception,
        title: exception.name,
        message:
          exception instanceof HttpException
            ? exception.message
            : exception.name,
        status: rep.statusCode.toString(),
        detail: exception.message,
        meta: {
          time: new Date().toISOString(),
        },
      }),
    );
  }
}
