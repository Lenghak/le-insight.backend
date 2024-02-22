import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Inject,
  Logger,
} from "@nestjs/common";

import { JSON_API_SERIALIZER } from "@/common/serializers/json-api-serializer.provider";

import { type FastifyRequest } from "fastify";
import { type FastifyReply } from "fastify/types/reply";
import JSONAPISerializer from "json-api-serializer";

@Catch(Error)
export class SerializedHTTPExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(JSON_API_SERIALIZER) private readonly serializer: JSONAPISerializer,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<FastifyRequest>();
    const rep = ctx.getResponse<FastifyReply>();

    if (!req.is404) {
      Logger.error(exception.message, exception.stack);
    }

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
